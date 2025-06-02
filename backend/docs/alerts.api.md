# Alerts API Documentation

This document outlines all available API endpoints for the alerts system in the Bien Unido application.

## Base URL

All endpoints are relative to: `/api/alerts`

## Authentication

All endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Get All Alerts

Retrieves alerts with optional filtering.

- **URL**: `/`
- **Method**: `GET`
- **Auth Required**: Yes (Verified Users)
- **Query Parameters**:

  - `category` (optional): Filter by category (emergency, weather, event, announcement, health, traffic)
  - `importance` (optional): Filter by importance level (low, medium, high, critical)
  - `barangay` (optional): Filter by barangay
  - `is_active` (optional): Filter by active status (true/false)
  - `page` (optional): Page number for pagination (default: 1)
  - `limit` (optional): Number of results per page (default: 10, max: 100)
  - `sort_by` (optional): Field to sort by (created_at, start_date, end_date, importance, title)
  - `sort_dir` (optional): Sort direction (ASC, DESC)
  - `search` (optional): Search term for title and body

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Alerts retrieved successfully",
      "data": {
        "alerts": [
          {
            "id": "number",
            "title": "string",
            "body": "string",
            "category": "string",
            "importance": "string",
            "barangay": "string",
            "image_url": "string",
            "start_date": "datetime",
            "end_date": "datetime",
            "is_active": "boolean",
            "created_at": "datetime",
            "updated_at": "datetime",
            "created_by": "number",
            "creator": {
              "id": "number",
              "first_name": "string",
              "last_name": "string",
              "role": "string"
            },
            "is_read": "boolean",
            "read_at": "datetime"
          }
        ],
        "pagination": {
          "total": "number",
          "page": "number",
          "limit": "number",
          "total_pages": "number"
        }
      }
    }
    ```

### Get Unread Alerts Count

Returns the count of unread alerts for the authenticated user.

- **URL**: `/unread-count`
- **Method**: `GET`
- **Auth Required**: Yes (Verified Users)

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Unread alert count retrieved successfully",
      "data": {
        "unread_count": "number"
      }
    }
    ```

### Get Alert by ID

Retrieves a specific alert by its ID.

- **URL**: `/:id`
- **Method**: `GET`
- **Auth Required**: Yes (Verified Users)
- **URL Parameters**:

  - `id`: Alert ID

- **Success Response**:

  - **Code**: 200
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Alert retrieved successfully",
      "data": {
        "alert": {
          "id": "number",
          "title": "string",
          "body": "string",
          "category": "string",
          "importance": "string",
          "barangay": "string",
          "image_url": "string",
          "start_date": "datetime",
          "end_date": "datetime",
          "is_active": "boolean",
          "created_at": "datetime",
          "updated_at": "datetime",
          "created_by": "number",
          "creator": {
            "id": "number",
            "first_name": "string",
            "last_name": "string",
            "role": "string"
          },
          "is_read": "boolean",
          "read_at": "datetime"
        }
      }
    }
    ```

- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "status": "error", "message": "Alert not found" }`

### Get Alert Read Statistics

Provides statistics on how many users have read a specific alert.

- **URL**: `/:id/stats`
- **Method**: `GET`
- **Auth Required**: Yes (Officials/Admins Only)
- **URL Parameters**:

  - `id`: Alert ID

- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Alert read statistics retrieved successfully",
      "data": {
        "total_users": "number",
        "read_count": "number",
        "read_percentage": "number",
        "reads": [
          {
            "alert_id": "number",
            "user_id": "number",
            "read_at": "datetime",
            "user": {
              "id": "number",
              "first_name": "string",
              "last_name": "string",
              "barangay": "string"
            }
          }
        ]
      }
    }
    ```

### Create Alert

Creates a new alert notification.

- **URL**: `/`
- **Method**: `POST`
- **Auth Required**: Yes (Officials/Admins Only)
- **Content-Type**: `multipart/form-data`
- **Body**:

  - `title` (required): Alert title (3-100 characters)
  - `body` (required): Alert body content
  - `category` (required): Alert category (emergency, weather, event, announcement, health, traffic)
  - `importance` (optional): Alert importance level (low, medium, high, critical)
  - `barangay` (optional): Target barangay (defaults to "ALL")
  - `image` (optional): Image file for the alert
  - `start_date` (optional): Start date of the alert (ISO format)
  - `end_date` (optional): End date of the alert (ISO format)
  - `is_active` (optional): Alert active status (true/false)

- **Success Response**:

  - **Code**: 201
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Alert created successfully",
      "data": {
        "alert": {
          "id": "number",
          "title": "string",
          "body": "string",
          "category": "string",
          "importance": "string",
          "barangay": "string",
          "image_url": "string",
          "start_date": "datetime",
          "end_date": "datetime",
          "is_active": "boolean",
          "created_at": "datetime",
          "updated_at": "datetime",
          "created_by": "number",
          "creator": {
            "id": "number",
            "first_name": "string",
            "last_name": "string",
            "role": "string"
          }
        }
      }
    }
    ```

- **Error Response**:
  - **Code**: 400
  - **Content**: `{ "status": "error", "message": "Validation failed", "errors": [...] }`

### Update Alert

Updates an existing alert.

- **URL**: `/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (Officials/Admins Only)
- **Content-Type**: `multipart/form-data`
- **URL Parameters**:
  - `id`: Alert ID
- **Body**:

  - `title` (optional): Alert title (3-100 characters)
  - `body` (optional): Alert body content
  - `category` (optional): Alert category (emergency, weather, event, announcement, health, traffic)
  - `importance` (optional): Alert importance level (low, medium, high, critical)
  - `barangay` (optional): Target barangay
  - `image` (optional): Image file for the alert
  - `start_date` (optional): Start date of the alert (ISO format)
  - `end_date` (optional): End date of the alert (ISO format)
  - `is_active` (optional): Alert active status (true/false)

- **Success Response**:

  - **Code**: 200
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Alert updated successfully",
      "data": {
        "alert": {
          "id": "number",
          "title": "string",
          "body": "string",
          "category": "string",
          "importance": "string",
          "barangay": "string",
          "image_url": "string",
          "start_date": "datetime",
          "end_date": "datetime",
          "is_active": "boolean",
          "created_at": "datetime",
          "updated_at": "datetime",
          "created_by": "number",
          "creator": {
            "id": "number",
            "first_name": "string",
            "last_name": "string",
            "role": "string"
          }
        }
      }
    }
    ```

- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "status": "error", "message": "Alert not found" }`

### Delete Alert

Deletes an alert.

- **URL**: `/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (Officials/Admins Only)
- **URL Parameters**:

  - `id`: Alert ID

- **Success Response**:

  - **Code**: 200
  - **Content**: `{ "status": "success", "message": "Alert deleted successfully" }`

- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "status": "error", "message": "Alert not found" }`

### Mark Alert as Read

Marks an alert as read for the current user.

- **URL**: `/:id/read`
- **Method**: `POST`
- **Auth Required**: Yes (Verified Users)
- **URL Parameters**:

  - `id`: Alert ID

- **Success Response**:

  - **Code**: 200
  - **Content**:
    ```json
    {
      "status": "success",
      "message": "Alert marked as read successfully",
      "data": {
        "read_at": "datetime"
      }
    }
    ```

- **Error Response**:
  - **Code**: 404
  - **Content**: `{ "status": "error", "message": "Alert not found" }`
