const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist (only in writable environments)
const logsDir = path.join(__dirname, '..', 'logs');
let canWriteToFile = true;

try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
} catch (error) {
  // In serverless environments like Vercel, filesystem is read-only
  // Disable file logging and only use console logging
  canWriteToFile = false;
  console.warn('Cannot create logs directory (read-only filesystem). File logging disabled.');
}

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.logToFile = process.env.LOG_TO_FILE === 'true' && canWriteToFile;
    this.logFile = path.join(logsDir, 'app.log');
    this.errorLogFile = path.join(logsDir, 'error.log');
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaString = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
  }

  writeToFile(message, isError = false) {
    if (!this.logToFile || !canWriteToFile) return;
    
    try {
      const logFile = isError ? this.errorLogFile : this.logFile;
      fs.appendFileSync(logFile, message + '\n');
    } catch (error) {
      // Silently fail if we can't write to file (serverless environment)
      console.warn('Failed to write to log file:', error.message);
    }
  }

  shouldLog(level) {
    const levels = { error: 0, warn: 1, info: 2, debug: 3 };
    return levels[level] <= levels[this.logLevel];
  }

  error(message, meta = {}) {
    if (!this.shouldLog('error')) return;
    
    const formattedMessage = this.formatMessage('error', message, meta);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage, true);
  }

  warn(message, meta = {}) {
    if (!this.shouldLog('warn')) return;
    
    const formattedMessage = this.formatMessage('warn', message, meta);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  info(message, meta = {}) {
    if (!this.shouldLog('info')) return;
    
    const formattedMessage = this.formatMessage('info', message, meta);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  debug(message, meta = {}) {
    if (!this.shouldLog('debug')) return;
    
    const formattedMessage = this.formatMessage('debug', message, meta);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  // Request logging middleware
  requestLogger() {
    return (req, res, next) => {
      const start = Date.now();
      
      res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          duration: `${duration}ms`,
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent')
        };
        
        if (res.statusCode >= 400) {
          this.warn(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, logData);
        } else {
          this.info(`HTTP ${res.statusCode} - ${req.method} ${req.url}`, logData);
        }
      });
      
      next();
    };
  }

  // Error logging middleware
  errorLogger() {
    return (err, req, res, next) => {
      const errorData = {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.url,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      };
      
      this.error('Unhandled error occurred', errorData);
      next(err);
    };
  }
}

module.exports = new Logger();