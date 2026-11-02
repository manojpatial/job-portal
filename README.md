# Job Portal API

Backend API for user accounts, companies, job listings, and applications. The API is served by the Express app in `backend`.

## Run locally

1. Install backend dependencies and start the API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. Create `backend/.env` with the following values:

   ```dotenv
 
   ```

   Cloudinary credentials are needed for registration and company/profile uploads. The server defaults to port `3000`.

3. API base URL:

   ```text
   http://localhost:3000
   ```

## Authentication and request formats

- User registration and login are public. Login returns a JWT and sets it in an HTTP-only `token` cookie (one-day expiry).
- Protected routes read the JWT from the `token` cookie; they do not read an `Authorization: Bearer` header. Send cookies on subsequent requests. For browser clients, use `credentials: "include"` (or Axios `withCredentials: true`).
- The configured CORS origin is `http://localhost:5173`, with credentials enabled.
- JSON requests use `Content-Type: application/json`. Upload routes use `multipart/form-data` with the file field named `file`.
- Roles accepted at registration/login are `student` and `recruiter`. Routes require authentication where noted, but the current middleware does not enforce role or resource ownership.
- Examples use placeholder IDs such as `USER_ID`, `JOB_ID`, and `COMPANY_ID`; replace them with MongoDB ObjectIds returned by the API.

## Routes

### Health

#### `GET /home`

Public server check. No request body.

**Response (`200`)**

```json
{
  "message": "Hello World!",
  "success": true
}
```

### User — `/api/v1/user`

#### `POST /api/v1/user/register`

Public. Register a user using `multipart/form-data`; all text fields and `file` are required by the current controller.

| Field | Type | Notes |
|---|---|---|
| `fullname` | string | Required |
| `email` | string | Required |
| `phoneNumber` | number | Required |
| `password` | string | Required |
| `role` | string | `student` or `recruiter` |
| `file` | file | Required profile photo; uploaded to Cloudinary |

**Request example**

```bash
curl -X POST http://localhost:3000/api/v1/user/register \
  -F "fullname=Alex Morgan" \
  -F "email=alex@example.com" \
  -F "phoneNumber=5551234567" \
  -F "password=secret123" \
  -F "role=student" \
  -F "file=@./profile.jpg"
```

**Response (`201`)**

```json
{
  "message": "User registered successfully",
  "success": true
}
```

#### `POST /api/v1/user/login`

Public. Send JSON fields `email`, `password`, and `role`.

**Request**

```json
{
  "email": "alex@example.com",
  "password": "secret123",
  "role": "student"
}
```

**Response (`200`)**

The response also sets the HTTP-only `token` cookie.

```json
{
  "message": "Welcome back! Alex Morgan",
  "user": {
    "_id": "USER_ID",
    "fullname": "Alex Morgan",
    "email": "alex@example.com",
    "phoneNumber": 5551234567,
    "role": "student",
    "profile": {
      "bio": "",
      "skills": [],
      "resume": "",
      "resumeOriginalName": "",
      "profilePhoto": "https://res.cloudinary.com/example/image/upload/profile.jpg"
    }
  },
  "success": true,
  "token": "JWT_TOKEN"
}
```

#### `GET /api/v1/user/logout`

Public. Clears the `token` cookie. No request body.

**Response (`200`)**

```json
{
  "message": "User logged out successfully",
  "success": true
}
```

#### `POST /api/v1/user/profile/update`

Authentication required. Send `multipart/form-data`; all fields are optional. Send `file` to upload/replace the user's resume.

| Field | Type | Notes |
|---|---|---|
| `fullname` | string | Optional |
| `email` | string | Optional |
| `phoneNumber` | number | Optional |
| `bio` | string | Optional |
| `skills` | string | Optional comma-separated list, e.g. `JavaScript, React` |
| `file` | file | Optional resume upload |

**Request example**

```bash
curl -X POST http://localhost:3000/api/v1/user/profile/update \
  -b "token=JWT_TOKEN" \
  -F "fullname=Alex Morgan" \
  -F "bio=Frontend developer" \
  -F "skills=JavaScript, React" \
  -F "file=@./resume.pdf"
```

**Response (`200`)**

```json
{
  "message": "User profile updated successfully",
  "success": true,
  "user": {
    "_id": "USER_ID",
    "fullname": "Alex Morgan",
    "email": "alex@example.com",
    "phoneNumber": 5551234567,
    "role": "student",
    "profile": {
      "bio": "Frontend developer",
      "skills": ["JavaScript", "React"],
      "resume": "https://res.cloudinary.com/example/raw/upload/resume.pdf",
      "resumeOriginalName": "resume.pdf",
      "profilePhoto": "https://res.cloudinary.com/example/image/upload/profile.jpg"
    }
  }
}
```

### Company — `/api/v1/company`

All company routes require authentication.

#### `POST /api/v1/company/register`

Register a company. JSON body requires `companyName`.

**Request**

```json
{
  "companyName": "Acme Inc."
}
```

**Response (`201`)**

```json
{
  "message": "Company registered successfully",
  "company": {
    "_id": "COMPANY_ID",
    "name": "Acme Inc.",
    "userId": "USER_ID",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  },
  "success": true
}
```

#### `GET /api/v1/company/get`

List companies associated with the authenticated user. No request body.

**Response (`200`)**

```json
{
  "companies": [
    {
      "_id": "COMPANY_ID",
      "name": "Acme Inc.",
      "userId": "USER_ID"
    }
  ],
  "success": true
}
```

#### `GET /api/v1/company/get/:id`

Fetch one company by its MongoDB ID. No request body.

**Request example**

```text
GET /api/v1/company/get/COMPANY_ID
```

**Response (`200`)**

```json
{
  "company": {
    "_id": "COMPANY_ID",
    "name": "Acme Inc.",
    "description": "Software and services",
    "website": "https://acme.example",
    "location": "Remote",
    "logo": "https://res.cloudinary.com/example/image/upload/logo.png",
    "userId": "USER_ID"
  },
  "success": true
}
```

#### `PUT /api/v1/company/update/:id`

Update a company using `multipart/form-data`. The current controller always processes `file`, so include a logo file even when only changing text fields.

| Field | Type | Notes |
|---|---|---|
| `name` | string | Company name |
| `description` | string | Description |
| `website` | string | Website URL |
| `location` | string | Location |
| `file` | file | Required by current implementation; uploaded as the company logo |

**Request example**

```bash
curl -X PUT http://localhost:3000/api/v1/company/update/COMPANY_ID \
  -b "token=JWT_TOKEN" \
  -F "name=Acme Inc." \
  -F "description=Software and services" \
  -F "website=https://acme.example" \
  -F "location=Remote" \
  -F "file=@./logo.png"
```

**Response (`200`)**

```json
{
  "message": "Company updated successfully",
  "company": {
    "_id": "COMPANY_ID",
    "name": "Acme Inc.",
    "description": "Software and services",
    "website": "https://acme.example",
    "location": "Remote",
    "logo": "https://res.cloudinary.com/example/image/upload/logo.png",
    "userId": "USER_ID"
  },
  "success": true
}
```

### Jobs — `/api/v1/job`

All job routes require authentication.

#### `POST /api/v1/job/post`

Create a job using JSON. Every listed field is required. `requirements` is a comma-separated string and is stored as an array; `salary`, `experience`, and `position` are converted to numbers. `experience` is stored as `experienceLevel`.

**Request**

```json
{
  "title": "Frontend Developer",
  "description": "Build and maintain web interfaces.",
  "requirements": "JavaScript, React, CSS",
  "salary": "95000",
  "experience": "3",
  "location": "Remote",
  "jobType": "Full-time",
  "position": "2",
  "companyId": "COMPANY_ID"
}
```

**Response (`201`)**

```json
{
  "message": "Job posted successfully",
  "job": {
    "_id": "JOB_ID",
    "title": "Frontend Developer",
    "description": "Build and maintain web interfaces.",
    "requirements": ["JavaScript", "React", "CSS"],
    "salary": 95000,
    "experienceLevel": 3,
    "location": "Remote",
    "jobType": "Full-time",
    "position": 2,
    "company": "COMPANY_ID",
    "created_by": "USER_ID",
    "applications": []
  },
  "success": true
}
```

#### `GET /api/v1/job/get`

List jobs, newest first. Optional query parameter `keyword` searches job title and description (case-insensitive).

**Request example**

```text
GET /api/v1/job/get?keyword=frontend
```

**Response (`200`)**

```json
{
  "jobs": [
    {
      "_id": "JOB_ID",
      "title": "Frontend Developer",
      "description": "Build and maintain web interfaces.",
      "requirements": ["JavaScript", "React", "CSS"],
      "salary": 95000,
      "experienceLevel": 3,
      "location": "Remote",
      "jobType": "Full-time",
      "position": 2,
      "company": {
        "_id": "COMPANY_ID",
        "name": "Acme Inc."
      },
      "created_by": "USER_ID",
      "applications": []
    }
  ],
  "success": true
}
```

#### `GET /api/v1/job/getadminjobs`

List jobs created by the authenticated user. No request body.

**Response (`200`)**

```json
{
  "jobs": [
    {
      "_id": "JOB_ID",
      "title": "Frontend Developer",
      "company": {
        "_id": "COMPANY_ID",
        "name": "Acme Inc."
      },
      "created_by": "USER_ID",
      "applications": []
    }
  ],
  "success": true
}
```

#### `GET /api/v1/job/get/:id`

Fetch a job by MongoDB ID. The `applications` field is populated.

**Request example**

```text
GET /api/v1/job/get/JOB_ID
```

**Response (`200`)**

```json
{
  "job": {
    "_id": "JOB_ID",
    "title": "Frontend Developer",
    "description": "Build and maintain web interfaces.",
    "requirements": ["JavaScript", "React", "CSS"],
    "salary": 95000,
    "experienceLevel": 3,
    "location": "Remote",
    "jobType": "Full-time",
    "position": 2,
    "company": "COMPANY_ID",
    "created_by": "USER_ID",
    "applications": []
  },
  "success": true
}
```

### Applications — `/api/v1/application`

All application routes require authentication. The current routes do not enforce student/recruiter roles or check that the authenticated user owns the requested job/application.

#### `GET /api/v1/application/apply/:id`

Apply the authenticated user to the job whose ID is `:id`. Despite creating data, this route uses `GET` and has no request body.

**Request example**

```text
GET /api/v1/application/apply/JOB_ID
```

**Response (`201`)**

```json
{
  "message": "Application submitted successfully",
  "success": true,
  "newApplication": {
    "_id": "APPLICATION_ID",
    "job": "JOB_ID",
    "applicant": "USER_ID",
    "status": "pending",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

#### `GET /api/v1/application/get`

List applications submitted by the authenticated user, newest first. No request body.

**Response (`200`)**

```json
{
  "message": "Applications fetched successfully",
  "success": true,
  "applications": [
    {
      "_id": "APPLICATION_ID",
      "job": {
        "_id": "JOB_ID",
        "title": "Frontend Developer",
        "company": {
          "_id": "COMPANY_ID",
          "name": "Acme Inc."
        }
      },
      "applicant": "USER_ID",
      "status": "pending"
    }
  ]
}
```

#### `GET /api/v1/application/:id/applicants`

Fetch a job and its applications, with applicant records populated. The path `:id` is the job ID.

**Request example**

```text
GET /api/v1/application/JOB_ID/applicants
```

**Response (`200`)**

```json
{
  "message": "Applications fetched successfully",
  "success": true,
  "job": {
    "_id": "JOB_ID",
    "title": "Frontend Developer",
    "applications": [
      {
        "_id": "APPLICATION_ID",
        "job": "JOB_ID",
        "applicant": {
          "_id": "USER_ID",
          "fullname": "Alex Morgan",
          "email": "alex@example.com",
          "profile": {
            "skills": ["JavaScript", "React"]
          }
        },
        "status": "pending"
      }
    ]
  }
}
```

#### `POST /api/v1/application/status/:id/update`

Update an application's status. `:id` is the application ID. Send JSON with `status` set to `pending`, `accepted`, or `rejected` (the value is lowercased before saving).

**Request**

```json
{
  "status": "accepted"
}
```

**Response (`200`)**

```json
{
  "message": "Application status updated successfully",
  "success": true,
  "application": {
    "_id": "APPLICATION_ID",
    "job": "JOB_ID",
    "applicant": "USER_ID",
    "status": "accepted",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T10:00:00.000Z"
  }
}
```

## Errors and response notes

Most controller errors use JSON with `success: false` and a `message`. Common cases include:

| Status | Example response |
|---|---|
| `400` | `{"message":"All fields are required","success":false}` |
| `401` | `{"message":"Unauthorized access. No token provided.","success":false}` |
| `404` | `{"message":"Job not found","success":false}` |
| `500` | Server/dependency error; the exact response varies by endpoint |

An empty collection is generally returned as a successful response with an empty array, rather than a `404`. Invalid IDs, database errors, and Cloudinary errors can result in `500` responses. Login and protected requests require the cookie from a successful login.
