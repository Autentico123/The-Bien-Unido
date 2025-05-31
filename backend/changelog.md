# Changelog

## [Unreleased]

### Added

- Created User model based on database schema
- Added models directory and index.js
- Created logs directory for application logs
- Added comprehensive authentication system:
  - User registration with validation
  - Login with JWT token generation
  - Account verification via SMS and email
  - Password reset functionality
  - Profile management endpoints
  - Device registration for push notifications
- Added middleware for authentication and authorization:
  - Token validation
  - Role-based access control
  - Request validation
- Added services:
  - Email service using Nodemailer
  - SMS service using Twilio
- Added UserDevice model for push notifications

### Fixed

- Fixed typo in logger.js (createLogge to createLogger)
- Fixed error handling middleware parameter names
- Fixed PORT variable in server.js (300 to 3000)
- Fixed rate limiting window calculation in app.js
