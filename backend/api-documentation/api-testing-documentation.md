# API TESTING DOCUMENTATION - BIEN UNIDO CITIZEN APP

## Overview

This document provides instructions for testing the Bien Unido Citizen App REST API endpoints. Tests should be performed in the order specified to ensure proper functionality.

## Requirements

- API Testing Tool (Postman, Insomnia, or similar)
- Valid user credentials
- Base URL: http://localhost:3000/api (development) or production URL

## Environment Setup

1. Set up environment variables in your API testing tool:
   - `baseUrl`: http://localhost:3000/api
   - `authToken`: [To be obtained from login response]
   - `userId`: [To be obtained from registration/login]
   - `verificationCode`: [To be obtained from SMS/email]
   - `resetToken`: [To be obtained from forgot password request]

## Test Cases

### 1. Authentication Endpoints

#### 1.1. User Registration

- **Endpoint**: POST `{{baseUrl}}/auth/register`
- **Description**: Register a new user
- **Headers**:
  - Content-Type: application/json
- **Request Body**:

```json
{
  "first_name": "Test",
  "last_name": "User",
  "email": "testuser@example.com",
  "mobile": "09123456789",
  "address": "123 Test Street, Bien Unido",
  "barangay": "Central",
  "password": "SecurePass123!"
}
```

- **Expected Response**: 201 Created

```json
{
  "status": "success",
  "message": "Registration successful. Please verify your account.",
  "data": {
    "id": 1,
    "email": "testuser@example.com",
    "mobile": "09123456789"
  }
}
```

- **Test Cases**:
  1. Test with valid data
  2. Test with existing email (should fail with 409)
  3. Test with existing mobile (should fail with 409)
  4. Test with invalid email format (should fail with 400)
  5. Test with weak password (should fail with 400)
  6. Test with missing required fields (should fail with 400)

#### 1.2. Account Verification

- **Endpoint**: POST `{{baseUrl}}/auth/verify-account`
- **Description**: Verify user account with code received via SMS/email
- **Headers**:
  - Content-Type: application/json
- **Request Body**:

```json
{
  "email": "testuser@example.com",
  "code": "123456"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Account verified successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "first_name": "Test",
      "last_name": "User",
      "email": "testuser@example.com",
      "role": "citizen"
    }
  }
}
```

- **Test Cases**:
  1. Test with valid verification code
  2. Test with invalid verification code (should fail with 400)
  3. Test with expired verification code (should fail with 400)
  4. Test for already verified account (should fail with 400)

#### 1.3. Resend Verification Code

- **Endpoint**: POST `{{baseUrl}}/auth/resend-verification`
- **Description**: Request a new verification code
- **Headers**:
  - Content-Type: application/json
- **Request Body**:

```json
{
  "email": "testuser@example.com"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Verification code sent successfully"
}
```

- **Test Cases**:
  1. Test with valid email
  2. Test with non-existent email (should fail)
  3. Test with already verified account (should fail)

#### 1.4. User Login

- **Endpoint**: POST `{{baseUrl}}/auth/login`
- **Description**: Authenticate user and get JWT token
- **Headers**:
  - Content-Type: application/json
- **Request Body**:

```json
{
  "email": "testuser@example.com",
  "password": "SecurePass123!"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "testuser@example.com",
      "first_name": "Test",
      "last_name": "User",
      "mobile": "09123456789"
    }
  }
}
```

- **Test Cases**:

  1. Test with valid email and password

  2. Test with incorrect password (should fail with 401)
  3. Test with non-existent user (should fail with 401)
  4. Test with unverified account (should return specific message)
  5. Test rate limiting by multiple failed attempts

#### 1.5. Forgot Password

- **Endpoint**: POST `{{baseUrl}}/auth/forgot-password`
- **Description**: Request password reset
- **Headers**:
  - Content-Type: application/json
- **Request Body**:

```json
{
  "email": "testuser@example.com"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Password reset instructions sent"
}
```

- **Test Cases**:
  1. Test with valid email
  2. Test with non-existent email (should still return 200 but no email sent)
  3. Test multiple requests within short time period (rate limiting)

#### 1.6. Reset Password

- **Endpoint**: POST `{{baseUrl}}/auth/reset-password`
- **Description**: Reset password using token received via email
- **Headers**:
  - Content-Type: application/json
- **Request Body**:

```json
{
  "email": "testuser@example.com",
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Password reset successfully"
}
```

- **Test Cases**:
  1. Test with valid token and strong password
  2. Test with invalid token (should fail with 400)
  3. Test with expired token (should fail with 400)
  4. Test with weak password (should fail with 400)

#### 1.7. Get Current User

- **Endpoint**: GET `{{baseUrl}}/auth/me`
- **Description**: Get current authenticated user profile
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "first_name": "Test",
      "last_name": "User",
      "email": "testuser@example.com",
      "mobile": "09123456789",
      "address": "123 Test Street, Bien Unido",
      "barangay": "Central",
      "verification_status": true
    }
  }
}
```

- **Test Cases**:
  1. Test with valid token
  2. Test with invalid token (should fail with 401)
  3. Test with expired token (should fail with 401)

#### 1.8. Update User Profile

- **Endpoint**: PUT `{{baseUrl}}/auth/me`
- **Description**: Update current user profile
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **Request Body**:

```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "address": "456 New Address, Bien Unido",
  "barangay": "North"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": 1,
      "first_name": "Updated",
      "last_name": "Name",
      "email": "testuser@example.com",
      "mobile": "09123456789",
      "address": "456 New Address, Bien Unido",
      "barangay": "North"
    }
  }
}
```

- **Test Cases**:
  1. Test with valid data
  2. Test with unverified account (should fail)
  3. Test with invalid data format (should fail with 400)
  4. Test without authentication (should fail with 401)

#### 1.9. Change Password

- **Endpoint**: PUT `{{baseUrl}}/auth/change-password`
- **Description**: Change user password
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **Request Body**:

```json
{
  "current_password": "SecurePass123!",
  "new_password": "NewSecurePass456!"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

- **Test Cases**:
  1. Test with valid current password and strong new password
  2. Test with incorrect current password (should fail with 401)
  3. Test with weak new password (should fail with 400)
  4. Test with unverified account (should fail)
  5. Test without authentication (should fail with 401)

#### 1.10. Register Device

- **Endpoint**: POST `{{baseUrl}}/auth/register-device`
- **Description**: Register a device for push notifications
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **Request Body**:

```json
{
  "device_token": "fcm-or-apns-device-token",
  "device_type": "android"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Device registered successfully",
  "data": {
    "id": 1,
    "device_token": "fcm-or-apns-device-token",
    "device_type": "android",
    "user_id": 1
  }
}
```

- **Test Cases**:
  1. Test with valid device token
  2. Test with missing device token (should fail with 400)
  3. Test with invalid device type (should fail with 400)
  4. Test without authentication (should fail with 401)
  5. Test registering the same device token again (should update)

## Testing Tips

1. **Sequential Testing**: Perform tests in order since some endpoints depend on successful execution of previous ones.

2. **Environment Variables**: Save important values (tokens, IDs) as environment variables for use in subsequent requests.

3. **Authentication**: Most endpoints require authentication. Make sure to update the JWT token after login.

4. **Error Handling**: Verify that proper error codes and messages are returned for invalid requests.

5. **Performance Testing**: Test rate limiting by sending multiple requests in quick succession.

6. **Batch Testing**: Create a collection in your API testing tool to run multiple tests in sequence.

7. **Automation**: Consider automating tests for regression testing using Postman Collections or similar tools.

## Common Response Status Codes

| Status Code           | Description                       | Common Scenarios                             |
| --------------------- | --------------------------------- | -------------------------------------------- |
| 200 OK                | Request successful                | GET, PUT, PATCH operations successful        |
| 201 Created           | Resource created successfully     | POST operations that create new resources    |
| 400 Bad Request       | Invalid input or validation error | Invalid data format, missing required fields |
| 401 Unauthorized      | Missing or invalid authentication | Missing or expired JWT token                 |
| 403 Forbidden         | Authenticated but not authorized  | User trying to access another user's data    |
| 404 Not Found         | Resource not found                | Accessing non-existent resources             |
| 409 Conflict          | Resource already exists           | Duplicate email, mobile registration         |
| 429 Too Many Requests | Rate limit exceeded               | Too many login attempts                      |
| 500 Server Error      | Unexpected server error           | Unhandled exceptions, database failures      |

## Notes

- Tokens expire after 24 hours by default
- Verification codes expire after 1 hour
- Password reset tokens expire after 30 minutes
- After 5 failed login attempts, the account may be temporarily locked (rate limiting)

---

Last updated: June 1, 2025
