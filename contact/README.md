# Contact Management App

A comprehensive contact management system for handling customer inquiries and support requests for Com Financial Services.

## Features

### 🏠 Dashboard
- **Overview Statistics**: Total messages, new messages, replied messages, and today's messages
- **Message List**: View all contact messages with filtering and search capabilities
- **Status Tracking**: Track which messages have been replied to
- **Quick Actions**: View details and reply to messages directly from the dashboard

### 📝 Contact Form
- **Customer Inquiry Form**: Public form for customers to submit inquiries
- **Service Selection**: Dropdown to select specific services
- **Contact Information**: Name, email, phone number collection
- **Message Validation**: Form validation using Zod schema
- **Success Feedback**: Confirmation when message is sent

### 📋 Contact Details
- **Detailed View**: Complete contact information and message content
- **Reply System**: Send responses to customer inquiries
- **Status Management**: Track reply status and view previous responses
- **Contact History**: View all interactions with a customer

### 🎨 UI Components
- **Modern Design**: Clean, professional interface using Tailwind CSS
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to `http://localhost:3000`

## API Endpoints

The app integrates with the following backend endpoints:

- `GET /api/admin/contacts` - Fetch all contact messages
- `GET /api/admin/contacts/:id` - Fetch specific contact details
- `POST /api/admin/contacts/:id/reply` - Send reply to contact
- `POST /api/support/contact` - Submit new contact form

## Project Structure

```
contact/
├── app/
│   ├── contact-detail/[id]/
│   │   └── page.tsx          # Contact detail and reply page
│   ├── contact-form/
│   │   └── page.tsx          # Public contact form
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Dashboard page
├── components/
│   ├── navigation.tsx        # Navigation component
│   └── ui/                   # Reusable UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       └── badge.tsx
├── lib/
│   ├── api-client.ts         # Axios configuration
│   └── utils.ts              # Utility functions
└── README.md
```

## Features in Detail

### Dashboard Features
- **Real-time Statistics**: Live count of messages by status
- **Advanced Filtering**: Filter by status (All, New, Replied)
- **Search Functionality**: Search across name, email, phone, service, and message content
- **Responsive Cards**: Each message displayed in an interactive card
- **Quick Actions**: Direct access to view details and reply

### Contact Form Features
- **Multi-step Validation**: Real-time form validation with helpful error messages
- **Service Categories**: Predefined list of services for easy selection
- **Contact Information**: Comprehensive contact details collection
- **Success States**: Clear feedback when form is submitted successfully
- **Responsive Design**: Works seamlessly on all device sizes

### Contact Detail Features
- **Complete Information**: All contact details in an organized layout
- **Message Threading**: View original message and all responses
- **Reply Management**: Send new replies or additional responses
- **Status Tracking**: Clear indication of message status
- **Navigation**: Easy navigation back to dashboard

## Usage

### For Contact Team
1. **View Dashboard**: See all incoming messages and statistics
2. **Filter Messages**: Use filters to focus on new or specific messages
3. **Search**: Use search to find specific messages quickly
4. **View Details**: Click on any message to see full details
5. **Reply**: Send responses directly from the detail page
6. **Track Status**: Monitor which messages have been replied to

### For Customers
1. **Access Form**: Navigate to the contact form page
2. **Fill Details**: Enter contact information and select service
3. **Write Message**: Describe your inquiry or request
4. **Submit**: Send the message and receive confirmation
5. **Wait for Response**: Receive reply within 24 hours

## Development

### Adding New Features
1. Create components in the `components/` directory
2. Add new pages in the `app/` directory
3. Update API client for new endpoints
4. Add proper TypeScript types
5. Test on multiple screen sizes

### Styling Guidelines
- Use Tailwind CSS classes for styling
- Follow the existing color scheme (blue primary)
- Ensure responsive design for all components
- Use consistent spacing and typography
- Add hover states and transitions for interactivity

## Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Environment Configuration**
   - Set `NEXT_PUBLIC_API_URL` to production API URL
   - Ensure backend API is accessible
   - Configure proper CORS settings

## Support

For technical support or questions about the contact management system, please contact the development team or refer to the main project documentation.