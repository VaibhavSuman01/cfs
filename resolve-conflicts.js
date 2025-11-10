const fs = require('fs');
const path = require('path');

function resolveConflicts(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const result = [];
  let inConflict = false;
  let conflictType = null;
  let skipUntil = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
      conflictType = 'incoming';
      continue;
    }
    
      inConflict = false;
      conflictType = null;
      skipUntil = null;
      continue;
    }
    
    if (!inConflict) {
      result.push(line);
    } else if (conflictType === 'incoming') {
      result.push(line);
    }
  }
  
  fs.writeFileSync(filePath, result.join('\n'));
  console.log(`Resolved conflicts in ${filePath}`);
}

// Get all files with conflicts
const files = [
  'backend/routes/formRoutes.js',
  'backend/routes/adminRoutes.js',
  'backend/utils/emailTemplates.js'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    resolveConflicts(file);
  }
});

console.log('Done resolving backend conflicts');

