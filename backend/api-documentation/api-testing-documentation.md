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
  "password": "SecurePass123!",
  "role": "citizen"
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
  7. Test with invalid role (should fail with 400)

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
      "first_name": "Test",
      "last_name": "User",
      "email": "testuser@example.com",
      "role": "citizen",
      "profile_photo_url": null
    }
  }
}
```

- **Test Cases**:
  1. Test with valid email and password
  2. Test with incorrect password (should fail with 401)
  3. Test with non-existent user (should fail with 401)
  4. Test with unverified account (should return specific message with requiresVerification flag)
  5. Test rate limiting by multiple failed attempts
  6. Test with device token and device type for automatic device registration

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
  "message": "If your email is registered, you will receive password reset instructions"
}
```

- **Test Cases**:
  1. Test with valid email
  2. Test with non-existent email (should still return 200 with same message)
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
      "role": "citizen",
      "verification_status": true,
      "created_at": "2023-06-15T08:30:00Z",
      "updated_at": "2023-06-15T08:30:00Z",
      "profile_photo_url": null
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
  "message": "Device registered successfully"
}
```

- **Test Cases**:
  1. Test with valid device token
  2. Test with missing device token (should fail with 400)
  3. Test with invalid device type (should fail with 400)
  4. Test without authentication (should fail with 401)
  5. Test registering the same device token again (should update)

### 2. Report Endpoints

#### 2.1. Get All Reports

- **Endpoint**: GET `{{baseUrl}}/reports`
- **Description**: Get all reports with optional filtering
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **Query Parameters**:
  - `status`: Filter by report status (e.g., "pending", "in_progress", "resolved", "rejected")
  - `type`: Filter by report type
  - `barangay`: Filter by barangay location
  - `search`: Search term for report title/description/location
  - `page`: Page number for pagination (default: 1)
  - `limit`: Number of results per page (default: 10)
  - `sort_by`: Field to sort by (created_at, updated_at, title, status, priority)
  - `sort_dir`: Sort direction (ASC or DESC, default: DESC)
  - `priority`: Filter by priority level
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Reports retrieved successfully",
  "data": {
    "reports": [
      {
        "id": 1,
        "title": "Road Damage Report",
        "description": "Large pothole on main street",
        "type": "infrastructure",
        "status": "pending",
        "location_address": "Main Street, Central",
        "barangay": "Central",
        "location_lat": 9.9234,
        "location_lng": 124.4321,
        "priority": "medium",
        "images": [
          {
            "id": 1,
            "image_url": "https://example.com/images/image1.jpg"
          }
        ],
        "created_at": "2023-06-15T08:30:00Z",
        "updated_at": "2023-06-15T08:30:00Z",
        "reporter": {
          "id": 1,
          "first_name": "Test",
          "last_name": "User",
          "email": "testuser@example.com"
        },
        "assignedTo": {
          "id": 2,
          "first_name": "Admin",
          "last_name": "User",
          "email": "admin@example.com"
        }
      }
    ],
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "total_pages": 5
    }
  }
}
```

- **Test Cases**:
  1. Test without authentication (should fail with 401)
  2. Test with unverified account (should fail)
  3. Test with different query parameters (status, type, priority)
  4. Test with search parameter
  5. Test sorting functionality
  6. Test pagination functionality
  7. Test as different user roles (citizens see only their reports)

#### 2.2. Get Report Statistics

- **Endpoint**: GET `{{baseUrl}}/reports/stats`
- **Description**: Get report statistics (Admin/Official only)
- **Authentication**: Required (Verified Admin/Official users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Report statistics retrieved successfully",
  "data": {
    "statusCounts": [
      { "status": "pending", "count": 35 },
      { "status": "in_progress", "count": 42 },
      { "status": "resolved", "count": 40 },
      { "status": "rejected", "count": 3 }
    ],
    "typeCounts": [
      { "type": "infrastructure", "count": 45 },
      { "type": "public_safety", "count": 25 },
      { "type": "environment", "count": 30 },
      { "type": "other", "count": 20 }
    ],
    "barangayCounts": [
      { "barangay": "Central", "count": 30 },
      { "barangay": "North", "count": 45 },
      { "barangay": "South", "count": 25 },
      { "barangay": "East", "count": 20 }
    ],
    "priorityCounts": [
      { "priority": "high", "count": 15 },
      { "priority": "medium", "count": 55 },
      { "priority": "low", "count": 50 }
    ],
    "resolutionStats": {
      "resolvedCount": 40,
      "avgResolutionTimeHours": 24.5,
      "minResolutionTimeHours": 2.3,
      "maxResolutionTimeHours": 72.1
    }
  }
}
```

- **Test Cases**:
  1. Test with admin/official account
  2. Test with regular citizen account (should fail with 403)
  3. Test without authentication (should fail with 401)
  4. Test with unverified account (should fail)

#### 2.3. Get Report by ID

- **Endpoint**: GET `{{baseUrl}}/reports/:id`
- **Description**: Get a single report by ID
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **URL Parameters**:
  - `id`: ID of the report to retrieve
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Report retrieved successfully",
  "data": {
    "report": {
      "id": 1,
      "title": "Road Damage Report",
      "description": "Large pothole on main street",
      "type": "infrastructure",
      "status": "pending",
      "location_address": "Main Street, Central",
      "barangay": "Central",
      "location_lat": 9.9234,
      "location_lng": 124.4321,
      "priority": "medium",
      "images": [
        {
          "id": 1,
          "image_url": "https://example.com/images/image1.jpg"
        }
      ],
      "created_at": "2023-06-15T08:30:00Z",
      "updated_at": "2023-06-15T08:30:00Z",
      "reporter": {
        "id": 1,
        "first_name": "Test",
        "last_name": "User",
        "email": "testuser@example.com"
      },
      "assignedTo": {
        "id": 2,
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@example.com"
      },
      "comments": [
        {
          "id": 1,
          "comment": "This will be fixed by Monday",
          "created_at": "2023-06-16T10:15:00Z",
          "user": {
            "id": 2,
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin"
          }
        }
      ],
      "statusHistory": [
        {
          "id": 1,
          "old_status": "pending",
          "new_status": "in_progress",
          "notes": "Assigned to maintenance team",
          "created_at": "2023-06-16T09:15:00Z",
          "user": {
            "id": 2,
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin"
          }
        }
      ]
    }
  }
}
```

- **Test Cases**:
  1. Test with valid report ID
  2. Test with non-existent report ID (should return 404)
  3. Test with a report not owned by the user (should fail with 403 for citizens)
  4. Test without authentication (should fail with 401)
  5. Test with unverified account (should fail)

#### 2.4. Create Report

- **Endpoint**: POST `{{baseUrl}}/reports`
- **Description**: Create a new report
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: multipart/form-data
- **Request Body**:

  - `title`: Title of the report (required)
  - `description`: Detailed description (required)
  - `type`: Report type (required)
  - `location_address`: Address or location description (required)
  - `barangay`: Barangay where incident occurred (required)
  - `location_lat`: GPS latitude coordinate
  - `location_lng`: GPS longitude coordinate
  - `images`: Image files (optional, multiple allowed)

- **Expected Response**: 201 Created

```json
{
  "status": "success",
  "message": "Report created successfully",
  "data": {
    "report": {
      "id": 1,
      "title": "Road Damage Report",
      "description": "Large pothole on main street",
      "type": "infrastructure",
      "status": "pending",
      "location_address": "Main Street, Central",
      "barangay": "Central",
      "location_lat": 9.9234,
      "location_lng": 124.4321,
      "priority": "medium",
      "created_at": "2023-06-15T08:30:00Z",
      "updated_at": "2023-06-15T08:30:00Z",
      "user_id": 1,
      "images": [
        {
          "id": 1,
          "image_url": "https://example.com/images/image1.jpg"
        }
      ]
    }
  }
}
```

- **Test Cases**:
  1. Test with valid data including images
  2. Test with valid data without images
  3. Test with missing required fields (should fail with 400)
  4. Test with invalid data formats (should fail with 400)
  5. Test with files that aren't images (should fail with 400)
  6. Test with files that exceed size limit (should fail with 400)
  7. Test without authentication (should fail with 401)
  8. Test with unverified account (should fail)

#### 2.5. Update Report Status

- **Endpoint**: PUT `{{baseUrl}}/reports/:id/status`
- **Description**: Update report status (Admin/Official only)
- **Authentication**: Required (Verified Admin/Official users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **URL Parameters**:
  - `id`: ID of the report to update
- **Request Body**:

```json
{
  "status": "in_progress",
  "notes": "Dispatched maintenance crew to assess damage",
  "assigned_to": 2
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Report status updated successfully",
  "data": {
    "report": {
      "id": 1,
      "title": "Road Damage Report",
      "status": "in_progress",
      "assigned_to": 2,
      "updated_at": "2023-06-16T09:45:00Z",
      "assignedTo": {
        "id": 2,
        "first_name": "Admin",
        "last_name": "User",
        "email": "admin@example.com"
      },
      "statusHistory": [
        {
          "id": 1,
          "old_status": "pending",
          "new_status": "in_progress",
          "notes": "Dispatched maintenance crew to assess damage",
          "created_at": "2023-06-16T09:45:00Z",
          "user": {
            "id": 2,
            "first_name": "Admin",
            "last_name": "User",
            "role": "admin"
          }
        }
      ]
    }
  }
}
```

- **Test Cases**:
  1. Test with admin/official account and valid data
  2. Test with regular citizen account (should fail with 403)
  3. Test with invalid status value (should fail with 400)
  4. Test with non-existent report ID (should return 404)
  5. Test with invalid assigned_to ID (should fail with 400)
  6. Test with non-admin/official assigned_to ID (should fail with 400)
  7. Test without authentication (should fail with 401)
  8. Test with unverified account (should fail)
  9. Test with resolved status and resolution notes

#### 2.6. Update Report Details

- **Endpoint**: PUT `{{baseUrl}}/reports/:id`
- **Description**: Update report details
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **URL Parameters**:
  - `id`: ID of the report to update
- **Request Body**:

```json
{
  "title": "Updated Road Damage Report",
  "description": "Large and dangerous pothole on main street",
  "type": "infrastructure",
  "priority": "high",
  "location_address": "Main Street near City Hall, Central",
  "location_lat": 9.9234,
  "location_lng": 124.4321,
  "barangay": "Central"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Report updated successfully",
  "data": {
    "report": {
      "id": 1,
      "title": "Updated Road Damage Report",
      "description": "Large and dangerous pothole on main street",
      "type": "infrastructure",
      "status": "pending",
      "priority": "high",
      "location_address": "Main Street near City Hall, Central",
      "barangay": "Central",
      "location_lat": 9.9234,
      "location_lng": 124.4321,
      "updated_at": "2023-06-16T10:30:00Z"
    }
  }
}
```

- **Test Cases**:
  1. Test with report owner account (citizen can only update title/description on pending reports)
  2. Test with admin/official account (can update all fields)
  3. Test with another user's report as citizen (should fail with 403)
  4. Test updating non-pending report as citizen (should fail with 403)
  5. Test with invalid data (should fail with 400)
  6. Test with non-existent report ID (should return 404)
  7. Test without authentication (should fail with 401)
  8. Test with unverified account (should fail)

#### 2.7. Delete Report

- **Endpoint**: DELETE `{{baseUrl}}/reports/:id`
- **Description**: Delete a report
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **URL Parameters**:
  - `id`: ID of the report to delete
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Report deleted successfully"
}
```

- **Test Cases**:
  1. Test with report owner account (can only delete pending reports)
  2. Test with admin account (can delete any report)
  3. Test with another user's report as citizen (should fail with 403)
  4. Test deleting non-pending report as citizen (should fail with 403)
  5. Test with non-existent report ID (should return 404)
  6. Test without authentication (should fail with 401)
  7. Test with unverified account (should fail)

#### 2.8. Add Report Comment

- **Endpoint**: POST `{{baseUrl}}/reports/:id/comments`
- **Description**: Add a comment to a report
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **URL Parameters**:
  - `id`: ID of the report to comment on
- **Request Body**:

```json
{
  "comment": "When will this be fixed? It's causing traffic problems."
}
```

- **Expected Response**: 201 Created

```json
{
  "status": "success",
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "id": 2,
      "comment": "When will this be fixed? It's causing traffic problems.",
      "report_id": 1,
      "user_id": 1,
      "created_at": "2023-06-17T14:25:00Z",
      "user": {
        "id": 1,
        "first_name": "Test",
        "last_name": "User",
        "role": "citizen"
      }
    }
  }
}
```

- **Test Cases**:
  1. Test with valid data
  2. Test with empty comment (should fail with 400)
  3. Test with non-existent report ID (should return 404)
  4. Test commenting on another user's report as citizen (should fail with 403)
  5. Test with admin/official account (can comment on any report)
  6. Test without authentication (should fail with 401)
  7. Test with unverified account (should fail)

### 3. Service Schedule Endpoints

#### 3.1. Get All Service Schedules

- **Endpoint**: GET `{{baseUrl}}/schedules`
- **Description**: Get all service schedules with optional filtering
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **Query Parameters**:
  - `service_type`: Filter by service type
  - `day_of_week`: Filter by day of the week
  - `barangay`: Filter by barangay location
  - `recurring`: Filter by recurring status (true/false)
  - `page`: Page number for pagination (default: 1)
  - `limit`: Number of results per page (default: 10)
  - `sort_by`: Field to sort by (day_of_week, service_type, barangay, start_time, next_date)
  - `sort_dir`: Sort direction (ASC or DESC, default: ASC)
  - `search`: Search term for service type/description/barangay
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Service schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": 1,
        "service_type": "Medical Mission",
        "description": "Free medical checkup and basic medicines",
        "day_of_week": "Monday",
        "barangay": "Central",
        "start_time": "08:00:00",
        "end_time": "16:00:00",
        "recurring": true,
        "next_date": null,
        "created_at": "2023-06-01T10:00:00Z",
        "updated_at": "2023-06-01T10:00:00Z"
      }
    ],
    "filters": {
      "barangays": ["Central", "North", "South"],
      "serviceTypes": ["Medical Mission", "Vaccination", "Dental Services"],
      "daysOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ]
    },
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "total_pages": 3
    }
  }
}
```

- **Test Cases**:
  1. Test without authentication (should fail with 401)
  2. Test with unverified account (should fail)
  3. Test with different query parameters (service_type, day_of_week, recurring)
  4. Test pagination functionality
  5. Test search functionality

#### 3.2. Get Service Schedules by Barangay

- **Endpoint**: GET `{{baseUrl}}/schedules/barangay/:barangay`
- **Description**: Get service schedules filtered by barangay
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **URL Parameters**:
  - `barangay`: Name of the barangay to filter by
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Service schedules retrieved successfully",
  "data": {
    "barangay": "Central",
    "scheduledDays": ["Monday", "Wednesday", "Friday"],
    "schedules": {
      "Monday": [
        {
          "id": 1,
          "service_type": "Medical Mission",
          "description": "Free medical checkup and basic medicines",
          "day_of_week": "Monday",
          "barangay": "Central",
          "start_time": "08:00:00",
          "end_time": "16:00:00",
          "recurring": true,
          "next_date": null,
          "created_at": "2023-06-01T10:00:00Z",
          "updated_at": "2023-06-01T10:00:00Z"
        }
      ],
      "Tuesday": [],
      "Wednesday": [
        {
          "id": 2,
          "service_type": "Dental Services",
          "description": "Free dental checkup",
          "day_of_week": "Wednesday",
          "barangay": "Central",
          "start_time": "09:00:00",
          "end_time": "15:00:00",
          "recurring": true,
          "next_date": null,
          "created_at": "2023-06-01T10:00:00Z",
          "updated_at": "2023-06-01T10:00:00Z"
        }
      ],
      "Thursday": [],
      "Friday": [],
      "Saturday": [],
      "Sunday": []
    }
  }
}
```

- **Test Cases**:
  1. Test with valid barangay name
  2. Test with non-existent barangay (should return empty arrays)
  3. Test without authentication (should fail with 401)
  4. Test with unverified account (should fail)

#### 3.3. Get Upcoming Service Schedules

- **Endpoint**: GET `{{baseUrl}}/schedules/upcoming`
- **Description**: Get upcoming service schedules
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **Query Parameters**:
  - `days`: Number of days to look ahead (default: 7)
  - `barangay`: Optional filter by barangay
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Upcoming schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": 1,
        "service_type": "Medical Mission",
        "description": "Free medical checkup and basic medicines",
        "day_of_week": "Monday",
        "barangay": "Central",
        "start_time": "08:00:00",
        "end_time": "16:00:00",
        "recurring": true,
        "next_date": null,
        "next_occurrence": "2023-06-19",
        "created_at": "2023-06-01T10:00:00Z",
        "updated_at": "2023-06-01T10:00:00Z"
      },
      {
        "id": 4,
        "service_type": "Vaccination",
        "description": "COVID-19 booster shots",
        "day_of_week": null,
        "barangay": "North",
        "start_time": "09:00:00",
        "end_time": "15:00:00",
        "recurring": false,
        "next_date": "2023-06-20",
        "next_occurrence": "2023-06-20",
        "created_at": "2023-06-01T10:00:00Z",
        "updated_at": "2023-06-01T10:00:00Z"
      }
    ],
    "date_range": {
      "from": "2023-06-17",
      "to": "2023-06-24"
    }
  }
}
```

- **Test Cases**:
  1. Test to verify only future schedules are returned
  2. Test with different day ranges (e.g., 3, 14, 30)
  3. Test with barangay filter
  4. Test without authentication (should fail with 401)
  5. Test with unverified account (should fail)

#### 3.4. Get Schedules by Service Type

- **Endpoint**: GET `{{baseUrl}}/schedules/service/:type`
- **Description**: Get service schedules filtered by service type
- **Authentication**: Required (Verified users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **URL Parameters**:
  - `type`: Type of service to filter by (e.g., "Medical Mission", "Vaccination")
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Service schedules retrieved successfully",
  "data": {
    "service_type": "Medical Mission",
    "total_schedules": 5,
    "barangays": ["Central", "North", "South"],
    "schedules": {
      "Central": [
        {
          "id": 1,
          "service_type": "Medical Mission",
          "description": "Free medical checkup and basic medicines",
          "day_of_week": "Monday",
          "barangay": "Central",
          "start_time": "08:00:00",
          "end_time": "16:00:00",
          "recurring": true,
          "next_date": null,
          "created_at": "2023-06-01T10:00:00Z",
          "updated_at": "2023-06-01T10:00:00Z"
        }
      ],
      "North": [
        {
          "id": 2,
          "service_type": "Medical Mission",
          "description": "Free medical checkup with specialists",
          "day_of_week": "Wednesday",
          "barangay": "North",
          "start_time": "09:00:00",
          "end_time": "15:00:00",
          "recurring": true,
          "next_date": null,
          "created_at": "2023-06-01T10:00:00Z",
          "updated_at": "2023-06-01T10:00:00Z"
        }
      ]
    }
  }
}
```

- **Test Cases**:
  1. Test with valid service type
  2. Test with non-existent service type (should return empty array)
  3. Test without authentication (should fail with 401)
  4. Test with unverified account (should fail)

#### 3.5. Create Service Schedule

- **Endpoint**: POST `{{baseUrl}}/schedules`
- **Description**: Create a new service schedule
- **Authentication**: Required (Verified Admin/Official users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **Request Body**:

```json
{
  "service_type": "Medical Mission",
  "description": "Free medical checkup and basic medicines",
  "day_of_week": "Monday",
  "start_time": "08:00:00",
  "end_time": "16:00:00",
  "barangay": "Central",
  "recurring": true,
  "next_date": null
}
```

- **Expected Response**: 201 Created

```json
{
  "status": "success",
  "message": "Service schedule created successfully",
  "data": {
    "schedule": {
      "id": 1,
      "service_type": "Medical Mission",
      "description": "Free medical checkup and basic medicines",
      "day_of_week": "Monday",
      "barangay": "Central",
      "start_time": "08:00:00",
      "end_time": "16:00:00",
      "recurring": true,
      "next_date": null,
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-01T10:00:00Z"
    }
  }
}
```

- **Test Cases**:
  1. Test with admin/official account and valid data
  2. Test with regular citizen account (should fail with 403)
  3. Test with invalid data (should fail with 400)
  4. Test with missing required fields (should fail with 400)
  5. Test with non-recurring schedule without next_date (should fail with 400)
  6. Test with invalid day_of_week value (should fail with 400)
  7. Test with invalid time format (should fail with 400)
  8. Test without authentication (should fail with 401)
  9. Test with unverified account (should fail)

#### 3.6. Update Service Schedule

- **Endpoint**: PUT `{{baseUrl}}/schedules/:id`
- **Description**: Update an existing service schedule
- **Authentication**: Required (Verified Admin/Official users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
  - Content-Type: application/json
- **URL Parameters**:
  - `id`: ID of the service schedule to update
- **Request Body**:

```json
{
  "service_type": "Medical and Dental Mission",
  "description": "Free medical and dental checkup with medicines",
  "day_of_week": "Tuesday",
  "start_time": "09:00:00",
  "end_time": "17:00:00",
  "barangay": "North",
  "recurring": false,
  "next_date": "2023-07-25"
}
```

- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Service schedule updated successfully",
  "data": {
    "schedule": {
      "id": 1,
      "service_type": "Medical and Dental Mission",
      "description": "Free medical and dental checkup with medicines",
      "day_of_week": "Tuesday",
      "barangay": "North",
      "start_time": "09:00:00",
      "end_time": "17:00:00",
      "recurring": false,
      "next_date": "2023-07-25",
      "created_at": "2023-06-01T10:00:00Z",
      "updated_at": "2023-06-02T14:30:00Z"
    }
  }
}
```

- **Test Cases**:
  1. Test with admin/official account and valid data
  2. Test with regular citizen account (should fail with 403)
  3. Test with invalid data (should fail with 400)
  4. Test with non-existent schedule ID (should return 404)
  5. Test with invalid day_of_week value (should fail with 400)
  6. Test with invalid time format (should fail with 400)
  7. Test without authentication (should fail with 401)
  8. Test with unverified account (should fail)

#### 3.7. Delete Service Schedule

- **Endpoint**: DELETE `{{baseUrl}}/schedules/:id`
- **Description**: Delete a service schedule
- **Authentication**: Required (Verified Admin/Official users only)
- **Headers**:
  - Authorization: Bearer {{authToken}}
- **URL Parameters**:
  - `id`: ID of the service schedule to delete
- **Expected Response**: 200 OK

```json
{
  "status": "success",
  "message": "Service schedule deleted successfully"
}
```

- **Test Cases**:
  1. Test with admin/official account
  2. Test with regular citizen account (should fail with 403)
  3. Test with non-existent schedule ID (should return 404)
  4. Test without authentication (should fail with 401)
  5. Test with unverified account (should fail)

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
