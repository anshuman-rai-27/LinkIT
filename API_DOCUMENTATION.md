# LinkIt API Documentation

## Overview

LinkIt is a skill-sharing platform that connects users who want to exchange skills. This API provides endpoints for user authentication, profile management, skill requests, feedback, and administrative functions.

**Base URL**: `http://localhost:3000/api` (or your deployed domain)

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Data Models

### User
- `id`: Integer (auto-increment)
- `email`: String (unique)
- `password`: String (hashed)
- `createdAt`: DateTime
- `verified`: Boolean

### Profile
- `id`: Integer (auto-increment)
- `name`: String (optional)
- `location`: String (optional)
- `profilePhoto`: String (optional)
- `availability`: String (optional)
- `isPublic`: Boolean (default: true)
- `role`: Role enum (USER, ADMIN)
- `createdAt`: DateTime
- `userId`: Integer (unique, references User)

### Skill
- `id`: Integer (auto-increment)
- `name`: String (unique)
- `category`: String (optional)

### SwapRequest
- `id`: Integer (auto-increment)
- `fromProfileId`: Integer
- `toProfileId`: Integer
- `offeredSkill`: String
- `requestedSkill`: String
- `status`: SwapStatus enum (PENDING, ACCEPTED, REJECTED, CANCELLED)
- `message`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Feedback
- `id`: Integer (auto-increment)
- `fromProfileId`: Integer
- `toProfileId`: Integer
- `rating`: Integer (1-5)
- `comment`: String (optional)
- `createdAt`: DateTime

## Endpoints

---

## Authentication Endpoints

### 1. User Registration

**POST** `/auth/register`

Creates a new user account and sends verification email.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User created"
}
```

**Status Codes:**
- `201`: User created successfully
- `400`: Missing required fields or invalid email format
- `409`: User already exists
- `500`: Internal server error

**Validation Rules:**
- Email must be valid format
- Password must be at least 6 characters
- Email must be unique

---

### 2. User Login

**POST** `/auth/login`

Authenticates user and returns JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200`: Login successful
- `400`: Missing email or password
- `401`: Invalid credentials

---

### 3. Email Verification

**GET** `/auth/verify?token=<verification-token>`

Verifies user email address.

**Response:**
```json
{
  "message": "User registered",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `201`: Email verified successfully
- `400`: Token not provided or invalid
- `404`: User not found

---

### 4. Forgot Password

**POST** `/auth/forgot-password`

Sends password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Email sent successfully"
}
```

**Status Codes:**
- `201`: Email sent successfully
- `400`: Email required
- `409`: User doesn't exist

---

### 5. Reset Password

**POST** `/auth/reset-password`

Resets user password using reset token.

**Request Body:**
```json
{
  "resetToken": "hashed-token",
  "password": "newpassword123"
}
```

**Response:**
```json
{
  "message": "User registered",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `201`: Password reset successfully
- `400`: Token or password not provided, or invalid token

---

## Session Management

### 6. Get Current Session

**GET** `/session`

Returns current user session information.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "user": {
    "userId": 1,
    "email": "user@example.com"
  }
}
```

**Status Codes:**
- `200`: Session valid
- `200`: No valid session (user: null)

---

## User Management

### 7. Get All Public Profiles

**GET** `/users`

Returns list of public user profiles with their skills.

**Response:**
```json
[
  {
    "id": "1",
    "name": "John Doe",
    "avatarUrl": "https://example.com/avatar.jpg",
    "initials": "JD",
    "borderColor": "border-blue-400",
    "location": "New York",
    "yearsExperience": "3+ years experience",
    "skillsOffered": ["JavaScript", "React"],
    "skillsNeeded": ["Python", "Django"],
    "rating": 4.7,
    "email": "john@example.com"
  }
]
```

**Status Codes:**
- `200`: Profiles retrieved successfully
- `200`: Empty array if no profiles found

---

### 8. Get User by ID

**GET** `/users/[id]`

Returns specific user profile by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "location": "New York",
  "profilePhoto": "https://example.com/avatar.jpg",
  "availability": "Weekends",
  "isPublic": true,
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1,
  "offeredSkills": [
    {
      "skill": {
        "id": 1,
        "name": "JavaScript"
      }
    }
  ],
  "wantedSkills": [
    {
      "skill": {
        "id": 2,
        "name": "Python"
      }
    }
  ]
}
```

**Status Codes:**
- `200`: User found
- `404`: User not found

---

## Profile Management

### 9. Get Current User Profile

**GET** `/profile`

Returns the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "location": "New York",
  "profilePhoto": "https://example.com/avatar.jpg",
  "availability": "Weekends",
  "isPublic": true,
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1,
  "offeredSkills": [
    {
      "skill": {
        "id": 1,
        "name": "JavaScript"
      }
    }
  ],
  "wantedSkills": [
    {
      "skill": {
        "id": 2,
        "name": "Python"
      }
    }
  ]
}
```

**Status Codes:**
- `200`: Profile found
- `401`: Unauthorized
- `404`: Profile not found

---

### 10. Create/Update Profile

**POST** `/profile`

Creates or updates the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "location": "New York",
  "profilePhoto": "https://example.com/avatar.jpg",
  "availability": "Weekends",
  "isPublic": true,
  "offeredSkills": ["JavaScript", "React"],
  "wantedSkills": ["Python", "Django"]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "location": "New York",
  "profilePhoto": "https://example.com/avatar.jpg",
  "availability": "Weekends",
  "isPublic": true,
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1,
  "offeredSkills": [
    {
      "skill": {
        "id": 1,
        "name": "JavaScript"
      }
    }
  ],
  "wantedSkills": [
    {
      "skill": {
        "id": 2,
        "name": "Python"
      }
    }
  ]
}
```

**Status Codes:**
- `200`: Profile updated successfully
- `401`: Unauthorized
- `404`: User not found
- `500`: Profile update failed

---

### 11. Get Profile by ID

**GET** `/profile/[profile_id]`

Returns a specific profile by ID.

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "location": "New York",
  "profilePhoto": "https://example.com/avatar.jpg",
  "availability": "Weekends",
  "isPublic": true,
  "role": "USER",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "userId": 1,
  "offeredSkills": [
    {
      "skill": {
        "id": 1,
        "name": "JavaScript"
      }
    }
  ],
  "wantedSkills": [
    {
      "skill": {
        "id": 2,
        "name": "Python"
      }
    }
  ]
}
```

**Status Codes:**
- `200`: Profile found
- `404`: Profile not found

---

### 12. Get All Profiles

**GET** `/profile/all`

Returns all profiles (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "location": "New York",
    "profilePhoto": "https://example.com/avatar.jpg",
    "availability": "Weekends",
    "isPublic": true,
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "userId": 1,
    "offeredSkills": [
      {
        "skill": {
          "id": 1,
          "name": "JavaScript"
        }
      }
    ],
    "wantedSkills": [
      {
        "skill": {
          "id": 2,
          "name": "Python"
        }
      }
    ]
  }
]
```

**Status Codes:**
- `200`: Profiles retrieved successfully
- `401`: Unauthorized
- `403`: Admin access required

---

### 13. Update Profile Photo

**POST** `/profile/photo`

Updates the authenticated user's profile photo.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "profilePhoto": "https://example.com/new-avatar.jpg"
}
```

**Response:**
```json
{
  "message": "Profile photo updated successfully"
}
```

**Status Codes:**
- `200`: Photo updated successfully
- `401`: Unauthorized
- `404`: Profile not found

---

## Skills Management

### 14. Get All Skills

**GET** `/skills`

Returns all available skills.

**Response:**
```json
[
  {
    "id": 1,
    "name": "JavaScript",
    "category": "Programming"
  },
  {
    "id": 2,
    "name": "Python",
    "category": "Programming"
  }
]
```

**Status Codes:**
- `200`: Skills retrieved successfully
- `500`: Failed to fetch skills

---

### 15. Get Skill by ID

**GET** `/skills/[skill_id]`

Returns a specific skill by ID.

**Response:**
```json
{
  "id": 1,
  "name": "JavaScript",
  "category": "Programming"
}
```

**Status Codes:**
- `200`: Skill found
- `404`: Skill not found

---

## Request Management

### 16. Get User Requests

**GET** `/request`

Returns all swap requests for the authenticated user (both sent and received).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user": {
      "id": "2",
      "name": "Jane Smith",
      "avatarUrl": "https://example.com/avatar2.jpg",
      "initials": "JS",
      "borderColor": "border-purple-400",
      "location": "Los Angeles",
      "yearsExperience": "3+ years experience",
      "skillsOffered": ["Python", "Django"],
      "skillsNeeded": ["JavaScript", "React"],
      "rating": 4.8,
      "email": "jane@example.com"
    },
    "status": "pending",
    "message": "I can help you with Python in exchange for JavaScript help",
    "offeredSkill": "Python",
    "requestedSkill": "JavaScript",
    "requestedAt": "2024-01-01T00:00:00.000Z",
    "isIncoming": true
  }
]
```

**Status Codes:**
- `200`: Requests retrieved successfully
- `401`: Unauthorized
- `404`: Profile not found
- `500`: Internal server error

---

### 17. Create Swap Request

**POST** `/request`

Creates a new swap request.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "profileId": "2",
  "offeredSkill": "JavaScript",
  "requestedSkill": "Python",
  "message": "I can help you with JavaScript in exchange for Python help"
}
```

**Response:**
```json
{
  "message": "Request sent successfully"
}
```

**Status Codes:**
- `201`: Request created successfully
- `400`: Missing required fields or invalid data
- `401`: Unauthorized
- `404`: Target profile not found
- `500`: Internal server error

---

### 18. Get Request by ID

**GET** `/request/[id]`

Returns a specific swap request by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "fromProfileId": 1,
  "toProfileId": 2,
  "offeredSkill": "JavaScript",
  "requestedSkill": "Python",
  "status": "PENDING",
  "message": "I can help you with JavaScript in exchange for Python help",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z",
  "fromProfile": {
    "id": 1,
    "name": "John Doe",
    "user": {
      "email": "john@example.com"
    }
  },
  "toProfile": {
    "id": 2,
    "name": "Jane Smith",
    "user": {
      "email": "jane@example.com"
    }
  }
}
```

**Status Codes:**
- `200`: Request found
- `401`: Unauthorized
- `404`: Request not found

---

### 19. Update Request Status

**PATCH** `/request/[request_id]/status`

Updates the status of a swap request.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "status": "ACCEPTED"
}
```

**Response:**
```json
{
  "message": "Request status updated successfully"
}
```

**Status Codes:**
- `200`: Status updated successfully
- `400`: Invalid status
- `401`: Unauthorized
- `404`: Request not found

---

## Feedback System

### 20. Submit Feedback

**POST** `/feedback`

Submits feedback for another user.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "toProfileId": "2",
  "rating": 5,
  "comment": "Excellent JavaScript skills and very helpful!"
}
```

**Response:**
```json
{
  "message": "Feedback submitted successfully"
}
```

**Status Codes:**
- `201`: Feedback submitted successfully
- `400`: Missing required fields, invalid rating, or self-rating attempt
- `401`: Unauthorized
- `404`: Target profile not found
- `409`: Already rated this user

**Validation Rules:**
- Rating must be between 1 and 5
- Cannot rate yourself
- Can only rate a user once

---

## Admin Endpoints

### 21. Get All Users (Admin)

**GET** `/admin/users`

Returns all users with pagination and filtering (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name or email
- `role`: Filter by role (USER, ADMIN)

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "location": "New York",
      "role": "USER",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "user": {
        "id": 1,
        "email": "john@example.com",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "verified": true
      },
      "offeredSkills": [
        {
          "skill": {
            "id": 1,
            "name": "JavaScript"
          }
        }
      ],
      "wantedSkills": [
        {
          "skill": {
            "id": 2,
            "name": "Python"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

**Status Codes:**
- `200`: Users retrieved successfully
- `401`: Unauthorized
- `403`: Admin access required
- `500`: Internal server error

---

### 22. Update User (Admin)

**PATCH** `/admin/users`

Updates user role or status (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "profileId": "2",
  "action": "make_admin"
}
```

**Available Actions:**
- `ban`: Ban user (sets role to USER)
- `unban`: Unban user (sets role to USER)
- `make_admin`: Make user admin
- `remove_admin`: Remove admin privileges

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": 2,
    "name": "Jane Smith",
    "role": "ADMIN"
  }
}
```

**Status Codes:**
- `200`: User updated successfully
- `400`: Missing required fields or invalid action
- `401`: Unauthorized
- `403`: Admin access required
- `500`: Internal server error

---

### 23. Get Admin Messages

**GET** `/admin/messages`

Returns all platform messages (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Welcome to LinkIt!",
    "content": "Welcome to our skill-sharing platform...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "adminId": 1
  }
]
```

**Status Codes:**
- `200`: Messages retrieved successfully
- `401`: Unauthorized
- `403`: Admin access required

---

### 24. Get Admin Reports

**GET** `/admin/reports`

Returns platform statistics and reports (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "totalUsers": 150,
  "totalRequests": 75,
  "activeRequests": 25,
  "completedSwaps": 50,
  "averageRating": 4.6
}
```

**Status Codes:**
- `200`: Reports retrieved successfully
- `401`: Unauthorized
- `403`: Admin access required

---

### 25. Get Admin Stats

**GET** `/admin/stats`

Returns detailed platform statistics (admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "userStats": {
    "total": 150,
    "verified": 120,
    "admins": 3
  },
  "requestStats": {
    "total": 75,
    "pending": 25,
    "accepted": 30,
    "rejected": 20
  },
  "skillStats": {
    "totalSkills": 45,
    "mostOffered": "JavaScript",
    "mostWanted": "Python"
  }
}
```

**Status Codes:**
- `200`: Stats retrieved successfully
- `401`: Unauthorized
- `403`: Admin access required

---

## Platform Messages

### 26. Get Platform Messages

**GET** `/platform-messages`

Returns active platform messages for all users.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Welcome to LinkIt!",
    "content": "Welcome to our skill-sharing platform...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Status Codes:**
- `200`: Messages retrieved successfully

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "message": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "message": "User not found"
}
```

### 409 Conflict
```json
{
  "message": "User already exists"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error"
}
```

## Rate Limiting

Currently, there are no rate limits implemented on the API endpoints. However, it's recommended to implement rate limiting for production use.

## Security Considerations

1. **JWT Tokens**: All authenticated endpoints require valid JWT tokens
2. **Password Hashing**: Passwords are hashed using bcrypt
3. **Email Verification**: Users must verify their email before accessing certain features
4. **Admin Authorization**: Admin endpoints require ADMIN role verification
5. **Input Validation**: All endpoints validate input data
6. **SQL Injection Protection**: Using Prisma ORM for database queries

## Development Setup

1. Install dependencies: `npm install`
2. Set up environment variables:
   ```
   DATABASE_URL="postgresql://..."
   JWT_SECRET="your-jwt-secret"
   ```
3. Run database migrations: `npx prisma migrate dev`
4. Start development server: `npm run dev`

## Testing

You can test the API endpoints using tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## Support

For API support or questions, please refer to the project documentation or contact the development team. 