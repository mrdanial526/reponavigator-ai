# Auth Service (JWT & Role-Based Access Control)

Handles user authentication, cryptographic session signing, and token verification for protected API endpoints.

## Responsibilities
- Verifies user email and hashed passwords against `Database` (`users` table).
- Signs HMAC-SHA256 JWT tokens with 7-day expiration.
- Provides `authGuard` middleware for `Backend Gateway`.
- Evaluates RBAC permissions for Admin, Editor, and Customer roles.

## Files
- `login/login.controller.ts`: Validates incoming credentials and responds with JWT token.
- `login/token.service.ts`: Cryptographic token signing and validation with revocation blacklist.
- `middleware/authGuard.ts`: Intercepts HTTP requests and verifies `Authorization: Bearer <token>`.
- `middleware/rbac.ts`: Enforces role-based permissions matrix for protected routes.
