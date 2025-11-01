# Com Financial Services - TestSprite Project Documentation

## Project Overview

**Com Financial Services** is a comprehensive business registration and compliance platform designed to simplify business formation, tax filing, and regulatory compliance for entrepreneurs and businesses across India. The platform offers a full suite of financial services through a modern web application with dedicated admin and contact management interfaces.

## Architecture

The project follows a multi-tier architecture with separate frontend applications and a unified backend API:

```
├── frontend/          # Main customer-facing application
├── admin/             # Admin dashboard for internal management
├── contact/           # Contact management system
├── backend/           # Express.js API server
└── testsprite_tests/  # TestSprite test configurations
```

## Technology Stack

### Frontend Applications
- **Framework**: Next.js 15.2.4 with React 19
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **Authentication**: JWT-based with custom auth provider
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend API
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer with disk/memory storage
- **Security**: Helmet, CORS, rate limiting, input sanitization
- **Email**: Nodemailer for notifications
- **Logging**: Custom logger with file and console output

### Database Models
- **User**: User accounts with role-based access
- **TaxForm**: Tax filing submissions (GST, ITR, TDS, etc.)
- **CompanyForm**: Company formation requests
- **OtherRegistrationForm**: Business registrations (LLP, Partnership, etc.)
- **ROCForm**: ROC compliance filings
- **ReportsForm**: Financial reports (Project, CMA, DSCR)
- **TrademarkISOForm**: Trademark and ISO certification
- **AdvisoryForm**: Business advisory services
- **Contact**: Customer inquiries and support
- **PasswordResetToken**: Password reset functionality

## Core Services

### 1. Company Formation
- Private Limited Company
- One Person Company (OPC)
- Public Limited Company
- Section 8 Company
- Nidhi Company
- Producer Company

### 2. Taxation Services
- **GST Filing**: Monthly/quarterly compliance (GSTR-1, GSTR-3B)
- **Income Tax Filing**: ITR preparation and e-filing (ITR-1 to ITR-7)
- **TDS Returns**: Tax deduction at source filings
- **Tax Planning**: Strategic tax optimization
- **EPFO Filing**: Employee Provident Fund compliance
- **ESIC Filing**: Employee State Insurance compliance
- **PT-Tax Filing**: Professional tax compliance
- **Corporate Tax Filing**: Corporate tax returns

### 3. Other Registration Services
- GST Registration
- LLP Registration
- Partnership Firm Registration
- Proprietorship Registration
- MSME/Udyam Registration
- EPFO Registration
- ESIC Registration
- PT Tax Registration
- IEC Registration
- Gumusta/Form-3/Shop Registration
- FSSAI (Food) License Registration
- Industry License Registration
- NGO Registration
- PAN Application
- TAN Application
- Start-up India Registration
- Digital Registration

### 4. Reports & Analysis
- **Project Reports**: Comprehensive business planning documents
- **CMA Reports**: Credit Monitoring Arrangement reports
- **DSCR Reports**: Debt Service Coverage Ratio analysis
- **Bank Reconciliation**: Financial statement reconciliation

### 5. Trademark & ISO Services
- Trademark Registration
- ISO 9001 Certification
- ISO 14001 Certification
- Copyright Registration

### 6. ROC Returns & Compliance
- Annual Filing (AOC-4 & MGT-7)
- Board Meeting & Resolutions
- Director Changes
- Share Transfer Documentation

### 7. Advisory Services
- Business Strategy Consulting
- Financial Planning & Analysis
- Compliance Advisory
- Other Finance-Related Services

## Key Features

### User Management
- **Flexible Authentication**: Login with email or PAN number
- **Role-Based Access**: User and admin roles with different permissions
- **Profile Management**: User profile with avatar upload
- **Password Reset**: Secure password reset via email
- **Account Blocking**: Admin can block/unblock user accounts

### Form Submission System
- **Multi-Service Forms**: Different forms for each service category
- **Document Upload**: Secure file upload with validation
- **Status Tracking**: Real-time status updates (Pending, Reviewed, Filed)
- **Admin Management**: Admin can update status and add reports
- **Edit History**: Track all changes made to submissions

### File Management
- **Secure Upload**: Multer-based file upload with size limits
- **File Validation**: Type checking for PDF, Excel, images, ZIP files
- **Storage Options**: Disk storage with memory fallback for serverless
- **Document Types**: Categorized document uploads by type

### Admin Dashboard
- **Submission Management**: View and manage all user submissions
- **User Management**: Admin user management with blocking capabilities
- **Statistics Dashboard**: Overview of submissions and user metrics
- **Report Generation**: Generate reports and add completion documents
- **Status Updates**: Update submission statuses and add remarks

### Contact Management
- **Inquiry System**: Public contact form for customer inquiries
- **Reply Management**: Admin can reply to customer inquiries
- **Status Tracking**: Track which inquiries have been replied to
- **Service Selection**: Customers can select specific services

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password

### Form Routes (`/api/forms`)
- `POST /tax` - Submit tax form
- `POST /company` - Submit company formation form
- `POST /other-registration` - Submit other registration form
- `POST /roc` - Submit ROC form
- `POST /reports` - Submit reports form
- `POST /trademark-iso` - Submit trademark/ISO form
- `POST /advisory` - Submit advisory form
- `GET /submissions/:type` - Get user submissions
- `GET /submission/:id` - Get specific submission
- `PUT /submission/:id` - Update submission
- `POST /submission/:id/documents` - Upload documents
- `POST /submission/:id/reports` - Add admin reports

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Admin dashboard statistics
- `GET /submissions` - All submissions with filters
- `GET /users` - User management
- `PUT /user/:id/block` - Block/unblock user
- `PUT /submission/:id/status` - Update submission status
- `POST /submission/:id/reports` - Add admin reports
- `GET /submission/:id/documents/:docId` - Download documents

### Support Routes (`/api/support`)
- `POST /contact` - Submit contact inquiry
- `GET /contacts` - Get all contact inquiries
- `PUT /contact/:id/reply` - Reply to contact inquiry

## Security Features

### Authentication & Authorization
- JWT-based authentication with configurable expiration
- Role-based access control (user/admin)
- Password hashing with bcrypt
- Secure token verification with clock sync handling

### Input Validation & Sanitization
- Express-validator for request validation
- MongoDB injection prevention
- File upload validation and sanitization
- PAN and Aadhaar number format validation

### Security Middleware
- Helmet for security headers
- CORS configuration
- Rate limiting for API endpoints
- Request sanitization and validation
- File upload security with type checking

### Data Protection
- Secure file storage with access controls
- Document encryption in database
- User data privacy controls
- Admin audit trails

## Development Setup

### Prerequisites
- Node.js 18+
- MongoDB
- npm or yarn

### Environment Variables

#### Backend (.env)
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ca_firm
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
LOG_LEVEL=info
LOG_TO_FILE=true

# Email Configuration
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
EMAIL_FROM=noreply@comfinancial.com
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_ENABLE_REGISTRATION=true
```

#### Admin (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

#### Contact (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

### Installation & Running

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd cfs-main
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Install Admin Dependencies**
   ```bash
   cd ../admin
   npm install
   ```

5. **Install Contact Dependencies**
   ```bash
   cd ../contact
   npm install
   ```

6. **Start Services**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev

   # Terminal 3 - Admin
   cd admin
   npm run dev

   # Terminal 4 - Contact
   cd contact
   npm run dev
   ```

## TestSprite Integration

### Test Configuration
The project includes TestSprite test configurations in the `testsprite_tests/` directory for automated testing of the application functionality.

### Test Coverage Areas
- **Authentication Flow**: Login, registration, password reset
- **Form Submissions**: All service form submissions
- **File Upload**: Document upload functionality
- **Admin Operations**: Admin dashboard and management features
- **API Endpoints**: Backend API testing
- **User Interface**: Frontend component testing

## Deployment Considerations

### Production Environment
- **Database**: MongoDB Atlas or self-hosted MongoDB
- **File Storage**: AWS S3 or similar cloud storage
- **Email Service**: Production SMTP service
- **Security**: Environment-specific JWT secrets
- **Logging**: Production logging configuration
- **Monitoring**: Application monitoring and error tracking

### Serverless Compatibility
- **File Upload**: Memory storage fallback for serverless environments
- **Logging**: Console-only logging for read-only filesystems
- **Database**: MongoDB Atlas for cloud deployment
- **Environment Variables**: Secure environment variable management

## Business Logic

### Service Categories
The platform organizes services into logical categories:
1. **Company Formation** - Business entity creation
2. **Taxation** - Tax compliance and filing
3. **Other Registration** - Various business registrations
4. **Reports** - Financial analysis and reporting
5. **Trademark & ISO** - Intellectual property and certification
6. **ROC Returns** - Corporate compliance
7. **Advisory** - Business consulting services

### Pricing Structure
- **Basic Package**: Essential services
- **Standard Package**: Comprehensive services
- **Premium Package**: Full-service with priority support

### Workflow Process
1. **User Registration/Login**
2. **Service Selection**
3. **Form Submission with Documents**
4. **Admin Review and Processing**
5. **Status Updates and Communication**
6. **Completion and Document Delivery**

## Future Enhancements

### Planned Features
- **Payment Integration**: Online payment processing
- **Document Generation**: Automated document creation
- **Notification System**: Real-time notifications
- **Mobile Application**: Native mobile app
- **Advanced Analytics**: Business intelligence dashboard
- **API Documentation**: Comprehensive API documentation
- **Multi-language Support**: Regional language support

### Technical Improvements
- **Performance Optimization**: Caching and optimization
- **Microservices Architecture**: Service decomposition
- **Real-time Features**: WebSocket integration
- **Advanced Security**: Enhanced security measures
- **Automated Testing**: Comprehensive test coverage
- **CI/CD Pipeline**: Automated deployment

## Support & Maintenance

### Monitoring
- Application performance monitoring
- Error tracking and logging
- User activity analytics
- System health checks

### Maintenance Tasks
- Regular database backups
- Security updates and patches
- Performance optimization
- User support and issue resolution
- Feature updates and enhancements

---

This documentation provides a comprehensive overview of the Com Financial Services platform, its architecture, features, and technical implementation details for TestSprite integration and testing purposes.
