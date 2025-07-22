# Com Financial Services Website & Admin Dashboard

A full-featured, modern, responsive website for a Financial Services firm with a matching admin dashboard.

## 🔧 Tech Stack

- **Frontend**: Next.js with Tailwind CSS
- **Backend**: Node.js + Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based Auth with email/PAN login support
- **File Upload**: Multer for secure file upload (PDF, ZIP, DOCX, JPG)

## 🎯 Project Structure

- A public-facing website for clients
- A secure admin dashboard for internal use

## 🔐 Authentication Features

- **Flexible Login**: Users can sign in using either their registered email address or PAN number
- **Role-based Access Control**: Different access levels for users and administrators
- **Secure Token Management**: JWT-based authentication with proper expiration and refresh mechanisms

## 📂 Directory Structure

```
project/
├── frontend/         # Next.js client
│   ├── pages/
│   ├── components/
│   └── styles/
├── backend/          # Express server
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── uploads/
├── .env
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository

2. Install frontend dependencies:

   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:

   ```
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/ca_firm
   JWT_SECRET=your_jwt_secret_key_change_in_production
   NODE_ENV=development

   # Email Configuration
   EMAIL_HOST=smtp.ethereal.email
   EMAIL_PORT=587
   EMAIL_USER=your_email_user
   EMAIL_PASS=your_email_password
   EMAIL_FROM=noreply@comfinancial.com
   ```

5. Create a `.env` file in the frontend directory with the following variables:

   ```
   # Backend API URL
   BACKEND_API_URL=http://localhost:5001

   # Feature flags
   NEXT_PUBLIC_ENABLE_REGISTRATION=true
   ```

6. Start the backend server:

   ```
   cd backend
   npm run dev
   ```

7. Start the frontend development server:

   ```
   cd frontend
   npm run dev
   ```

## 📱 Features

### Public Website

- Home page with hero section, testimonials, and about section
- Services page with tax filing, GST registration, company incorporation, and financial auditing
- Tax filing form with file upload functionality
- Contact page with form and Google Maps embed

### Admin Dashboard

- Secure login with JWT authentication
- Dashboard with statistics
- Submissions list with filters
- Detailed view of submissions with file downloads
- Status update functionality
