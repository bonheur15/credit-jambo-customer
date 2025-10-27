# API Endpoints

This document provides a detailed overview of all the API endpoints for the Jambo Credit application.

## Authentication

Most endpoints require a valid JSON Web Token (JWT) to be included in the `Authorization` header of the request. The token should be prefixed with `Bearer `.

---

## Users

### `POST /users`

- **Summary:** Register a new user.
- **Description:** Creates a new user account.
- **Authentication:** None.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password_hash": "your_password",
    "name": "John Doe"
  }
  ```
- **Responses:**
  - `201 Created`: User created successfully.
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "email": "user@example.com",
      "name": "John Doe"
    }
    ```
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`: Server error.

### `POST /users/login`

- **Summary:** Login a user.
- **Description:** Authenticates a user and returns a JWT token.
- **Authentication:** None.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password_hash": "your_password"
  }
  ```
- **Responses:**
  - `200 OK`: Login successful.
    ```json
    {
      "jwt": "your_jwt_token",
      "refresh_token": "your_refresh_token"
    }
    ```
  - `400 Bad Request`: Validation error.
  - `401 Unauthorized`: Invalid credentials.
  - `500 Internal Server Error`: Server error.

### `POST /users/refresh-token`

- **Summary:** Refresh JWT token.
- **Description:** Refreshes an expired JWT token using a refresh token.
- **Authentication:** None.
- **Request Body:**
  ```json
  {
    "refresh_token": "your_refresh_token"
  }
  ```
- **Responses:**
  - `200 OK`: Token refreshed successfully.
    ```json
    {
      "jwt": "your_new_jwt_token",
      "refresh_token": "your_new_refresh_token"
    }
    ```
  - `401 Unauthorized`: Invalid refresh token.
  - `500 Internal Server Error`: Server error.

---

## Devices

### `POST /devices`

- **Summary:** Register a new device.
- **Description:** Registers a new device for a user.
- **Authentication:** JWT Bearer Token.
- **Request Body:**
  ```json
  {
    "device_id": "some-unique-device-id",
    "device_meta": { "os": "Android", "version": "12" },
    "created_by": "client",
    "user_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876"
  }
  ```
- **Responses:**
  - `201 Created`: Device registered successfully.
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "user_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
      "device_id": "some-unique-device-id",
      "device_meta": { "os": "Android", "version": "12" },
      "registered_at": "2025-10-27T10:00:00.000Z",
      "created_by": "client"
    }
    ```
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`: Server error.

---

## Device Verifications

### `POST /device-verifications`

- **Summary:** Create a new device verification request.
- **Description:** Initiates a new verification process for a device.
- **Authentication:** JWT Bearer Token.
- **Request Body:**
  ```json
  {
    "device_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
    "admin_id": "g1h2i3j4-k5l6-7890-1234-567890abcdef",
    "status": "PENDING",
    "note": "Initial verification request"
  }
  ```
- **Responses:**
  - `201 Created`: Device verification request created successfully.
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "device_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
      "admin_id": "g1h2i3j4-k5l6-7890-1234-567890abcdef",
      "status": "PENDING",
      "created_at": "2023-10-27T10:00:00.000Z",
      "note": "Initial verification request"
    }
    ```
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`: Server error.

### `GET /device-verifications/:deviceId`

- **Summary:** Get device verification status.
- **Description:** Retrieves the verification status of a specific device by its ID.
- **Authentication:** JWT Bearer Token.
- **URL Parameters:**
  - `deviceId` (string, required): The ID of the device.
- **Responses:**
  - `200 OK`: Device verification status.
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "device_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
      "admin_id": "g1h2i3j4-k5l6-7890-1234-567890abcdef",
      "status": "VERIFIED",
      "created_at": "2023-10-27T10:00:00.000Z",
      "note": "Device verified by admin"
    }
    ```
  - `404 Not Found`: Device not found.
  - `500 Internal Server Error`: Server error.

---

## Accounts

### `POST /accounts`

- **Summary:** Create a new account.
- **Description:** Creates a new account for a user.
- **Authentication:** JWT Bearer Token.
- **Request Body:**
  ```json
  {
    "currency": "RWF"
  }
  ```
- **Responses:**
  - `201 Created`: Account created successfully.
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "user_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
      "currency": "RWF",
      "created_at": "2023-10-27T10:00:00.000Z"
    }
    ```
  - `400 Bad Request`: Validation error.
  - `500 Internal Server Error`: Server error.

### `GET /accounts`

- **Summary:** Get all accounts.
- **Description:** Retrieves a list of all accounts for the authenticated user.
- **Authentication:** JWT Bearer Token.
- **Responses:**
  - `200 OK`: A list of accounts.
    ```json
    [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "user_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
        "currency": "RWF",
        "created_at": "2023-10-27T10:00:00.000Z"
      }
    ]
    ```
  - `500 Internal Server Error`: Server error.

### `GET /accounts/:accountId/balance`

- **Summary:** Get account balance.
- **Description:** Retrieves the current balance for a specific account.
- **Authentication:** JWT Bearer Token.
- **URL Parameters:**
  - `accountId` (string, required): The ID of the account.
- **Responses:**
  - `200 OK`: Account balance retrieved successfully.
    ```json
    {
      "account_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "balance": 1000.00,
      "currency": "RWF",
      "last_snapshot_at": "2023-10-27T10:00:00.000Z"
    }
    ```
  - `404 Not Found`: Account not found.
  - `500 Internal Server Error`: Server error.

---

## Transactions

### `POST /:accountId/transactions`

- **Summary:** Create a new transaction.
- **Description:** Creates a new transaction (deposit or withdrawal) for a given account.
- **Authentication:** JWT Bearer Token.
- **URL Parameters:**
  - `accountId` (string, required): The ID of the account.
- **Request Body:**
  ```json
  {
    "type": "DEPOSIT",
    "amount": 100.00,
    "reference": "salary-oct-2023",
    "meta": { "bank": "ExampleBank" }
  }
  ```
- **Responses:**
  - `201 Created`: Transaction created successfully.
    ```json
    {
      "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      "account_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
      "type": "DEPOSIT",
      "amount": 100.00,
      "reference": "salary-oct-2023",
      "meta": { "bank": "ExampleBank" },
      "created_at": "2023-10-27T10:00:00.000Z",
      "created_by": "g1h2i3j4-k5l6-7890-1234-567890abcdef",
      "status": "COMPLETED"
    }
    ```
  - `400 Bad Request`: Validation error.
  - `404 Not Found`: Account not found.
  - `500 Internal Server Error`: Server error.

### `GET /:accountId/transactions`

- **Summary:** Get all transactions for an account.
- **Description:** Retrieves a list of all transactions for a specific account.
- **Authentication:** JWT Bearer Token.
- **URL Parameters:**
  - `accountId` (string, required): The ID of the account.
- **Responses:**
  - `200 OK`: A list of transactions.
    ```json
    [
      {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "account_id": "f1e2d3c4-b5a6-9876-5432-10fedcba9876",
        "type": "DEPOSIT",
        "amount": 100.00,
        "reference": "salary-oct-2023",
        "meta": { "bank": "ExampleBank" },
        "created_at": "2023-10-27T10:00:00.000Z",
        "created_by": "g1h2i3j4-k5l6-7890-1234-567890abcdef",
        "status": "COMPLETED"
      }
    ]
    ```
  - `404 Not Found`: Account not found.
  - `500 Internal Server Error`: Server error.
