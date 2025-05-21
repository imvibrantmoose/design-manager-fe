# Design Template Manager API

This is the backend API for the Design Template Manager application. It's built with Spring Boot and MongoDB.

## Prerequisites

- Java 17 or higher
- Maven
- MongoDB

## Setup

1. Make sure MongoDB is running on localhost:27017 (or update the connection string in application.properties)
2. Build the project: `mvn clean install`
3. Run the application: `mvn spring-boot:run`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/signup` - Register a new user

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID (Admin or self)
- `POST /api/users` - Create a new user (Admin only)
- `PUT /api/users/{id}` - Update user (Admin or self)
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Templates

- `GET /api/templates` - Get all templates
- `GET /api/templates/{id}` - Get template by ID
- `GET /api/templates/category/{category}` - Get templates by category
- `GET /api/templates/search?query={query}` - Search templates
- `POST /api/templates` - Create a new template (Admin or Read-Write)
- `PUT /api/templates/{id}` - Update template (Admin or Read-Write)
- `DELETE /api/templates/{id}` - Delete template (Admin only)

## Security

The API uses JWT for authentication. Include the JWT token in the Authorization header for protected endpoints:

```
Authorization: Bearer <token>
```

## User Roles

- `READ` - Can view templates only
- `READ_WRITE` - Can view, create, and edit templates
- `ADMIN` - Full access to all features including user management
