# 📱 Bien Unido Citizen App

A comprehensive digital platform connecting citizens of Bien Unido with their local government unit (LGU), enabling efficient communication, service access, and civic engagement.

## 🌟 Overview

The Bien Unido Citizen App empowers residents to report issues, receive important alerts, access public services, and connect with local officials - all through a user-friendly digital interface.

## 🧩 Core Features

### 📍 Issue Reporting

- **Photo Upload**: Capture and upload images of local issues
- **Auto-Location**: GPS-enabled location tagging
- **Categorization**: Organize reports by type (garbage, road damage, flooding, etc.)
- **Status Tracking**: Monitor report progress (pending → in progress → resolved)

### 🚨 Alerts & Announcements

- **Admin Dashboard**: LGU staff can create and manage alerts
- **Alert Types**: Weather updates, community events, emergency notices
- **Multi-channel Notifications**: SMS integration via Twilio

### 🧾 Public Service Access

- **Service Schedules**: View garbage collection, mobile health checkups
- **Document Downloads**: Access permit forms and applications (PDF)
- **Status Inquiries**: Check permit and clearance application status
- **Deadline Reminders**: Important permit and service deadlines

### 📞 Contact Directory

- **Official Directory**: Complete list of local government officials
- **Contact Information**: Phone numbers, emails, office locations
- **Smart Filtering**: Search by barangay or department

## 🧱 Tech Stack

### Frontend

- **Web**: React.js with modern hooks and context
- **Mobile**: React Native for cross-platform mobile app
- **Styling**:
  - **Web**: Tailwind CSS for utility-first styling and daisyui
  - **Mobile**: React Native Elements
- **Animation**: Framer Motion for smooth UI transitions and interactions

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API design

### Database

- **Primary**: MySQL for structured data
- **ORM**: Sequelize for database operations

### External Services

- **File Storage**: Cloudinary for image uploads and management
- **Geolocation**: HTML5 Geolocation API / React Native Geolocation
- **Notifications**:
  - Email: Nodemailer
  - SMS: Twilio API

## 🗂 Database Schema

### Core Tables

```sql
-- Users (Citizens)
User: id, name, address, email, mobile, password_hash, created_at, updated_at

-- Issue Reports
Report: id, type, location_lat, location_lng, photo_url, description, status, reporter_id, created_at, updated_at

-- LGU Alerts
Alert: id, title, body, category, date_posted, is_active, created_by

-- Service Schedules
Schedule: id, service_type, day, time, barangay, description

-- Government Officials
Official: id, name, position, barangay, contact_number, email, office_location
```

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16+)
- MySQL (v8.0+)
- npm or yarn package manager

### Backend Setup

```bash
# Clone the repository
git clone <repository-url>
cd bien-unido-citizen-app

# Install backend dependencies
cd backend
npm install

# Create environment file
cp .env.example .env

# Configure your environment variables
# Database connection, JWT secret, Cloudinary, Twilio credentials

# Run database migrations
npm run migrate

# Seed initial data
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Start development server
npm start
```

### Mobile App Setup (React Native)

```bash
# Install mobile dependencies
cd mobile
npm install

# iOS
cd ios && pod install && cd ..
npx react-native run-ios

# Android
npx react-native run-android
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=bien_unido_app
DB_USER=your_username
DB_PASS=your_password

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Email
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password
```

## 📚 API Documentation

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Reports

- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `PUT /api/reports/:id` - Update report status
- `DELETE /api/reports/:id` - Delete report

### Alerts

- `GET /api/alerts` - Get active alerts
- `POST /api/alerts` - Create new alert (admin only)
- `PUT /api/alerts/:id` - Update alert
- `DELETE /api/alerts/:id` - Delete alert

### Services

- `GET /api/schedules` - Get service schedules
- `GET /api/officials` - Get officials directory

## 🏗 Project Structure

```
bien-unido-citizen-app/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── mobile/
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── services/
│   └── android/ios/
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:

- Create an issue in this repository
- Contact the development team
- Email: support@bienunido-app.gov.ph

## 🚀 Deployment

### Production Deployment

- **Backend**: Deploy to services like Heroku, DigitalOcean, or AWS
- **Frontend**: Deploy to Netlify, Vercel, or AWS S3
- **Database**: Use managed MySQL services like AWS RDS or PlanetScale
- **Mobile**: Deploy to Google Play Store and Apple App Store

---

**Built with ❤️ for the citizens of Bien Unido**
