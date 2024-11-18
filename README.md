# Mern Advanced Authentication System

## Frontend

    - Login
    - Signup
    - Verify Email
    - Forgot Password
    - Reset Password
    - Dashboard

## Backend

- API

  - POST signup - http://localhost:8000/api/auth/signup
  - POST login - http://localhost:8000/api/auth/login
  - POST verify email - http://localhost:8000/api/auth/verify-email
  - POST logout - http://localhost:8000/api/auth/logout
  - POST forgot password - http://localhost:8000/api/auth/forgot-password
  - POST reset password - http://localhost:8000/api/auth/reset-password/:token
  - GET check auth - http://localhost:8000/api/auth/check-auth

- Schema
  - name
  - email
  - password
  - lastLogin
  - isVerified
  - resetPasswordToken
  - resetPasswordExpiresAt
  - verificationToken
  - verificationTokenExpiresAt
  - createdAt
  - updatedAt
