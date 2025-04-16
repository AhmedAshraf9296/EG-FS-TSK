# EG-FS [![Live Demo](https://img.shields.io/badge/Live%20Demo-Click%20Here-blue)](http://ec2-51-21-248-37.eu-north-1.compute.amazonaws.com:3000/)

This project consists of a NestJS monorepo backend and a frontend application, containerized with Docker for easy deployment.

## Live Demo

The application is deployed and accessible at:
[http://ec2-51-21-248-37.eu-north-1.compute.amazonaws.com:3000/](http://ec2-51-21-248-37.eu-north-1.compute.amazonaws.com:3000/)

The demo is hosted on AWS EC2 instance and includes both the frontend and backend services, demonstrating all the required functionality.

## Project Structure

- `backend/` - NestJS monorepo containing:
  - Auth Service
  - Client Service
- `frontend/` - Frontend application
- `docker-compose.yml` - Main Docker Compose file for orchestrating all services

## Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

## Environment Variables

The following environment variables are required and will be shared privately:

### Backend Variables
- `MONGO_DB` - MongoDB connection string
- `AUTH_PORT` - Port for the Auth service
- `CLIENT_PORT` - Port for the Client service
- `JWT_SECRET` - Secret key for JWT token generation
- `JWT_EXPIRES_IN` - JWT token expiration time

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd [repository-name]
```

2. Set up environment variables:
   - Create `.env` file in the `backend` directory (variables will be shared privately)

3. Start the application:
```bash
docker-compose up -d
```

This will start:
- Auth Service
- Client Service
- Frontend Application (accessible on port 3000)

## Services

### Backend Services

1. **Auth Service**
   - Handles authentication and authorization
   - Port: Defined in .env (AUTH_PORT)

2. **Client Service**
   - Handles client-related operations
   - Port: Defined in .env (CLIENT_PORT)

### Frontend

- Runs on port 3000
- Built with modern web technologies
- Containerized for consistent deployment

## Development

For local development:

1. Backend:
```bash
cd backend
npm install
npm run start:dev
```

2. Frontend:
```bash
cd frontend
npm install
npm start
```

## Production Deployment

The application is containerized and can be deployed using Docker Compose:

```bash
docker-compose up -d
```

## Notes

- Environment variables are required for proper functioning and will be shared privately
- MongoDB connection should be configured through environment variables
- All services are configured to restart automatically unless stopped manually

## License

[Add your license information here]
