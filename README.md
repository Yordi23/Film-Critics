<div align="center">
  <img src="resourses/film-critics-logo.png" alt="Film Critics Logo">
</div>

## What's Film Critics?

Film Critics is a platform dedicated to film enthusiasts, providing a space to express their honest opinions about their favorite, or not-so-favorite, films. Users can share ratings and interact with the communitys.

### Core funcionalities

Film Critics offers the following core functionalities:

- **Authentication and Role-Based Authorization:** Secure user access with role-based permissions.
- **CRUD Operations for Various Entities:** Create, read, update, and delete operations for different entities.
- **Movie Reviews:** Users can create detailed movie reviews and interact with others by liking or disliking their reviews.
- **Email Notifications:** Receive email notifications for certain user interactions and updates.

## Motivation

This is a personal project intended mainly to update my professional portfolio and showcase my domain of knowledge on backend development.

## How to use it?

To get started with Film Critics, follow these steps:

1. Create the following files inside the `.env` folder: `auth.env`, `film-critic.env`, `notification.env`, and the `postgres.env` file inside the `postgres` folder.
2. Copy the default values from the corresponding `.env.example` files to their respective `.env` files.
3. Fill in the empty fields with your preferred values. Note that the `DB_USER` and `DB_PASSWORD` fields must match the `POSTGRES_USER` and `POSTGRES_PASSWORD` fields, respectively.
4. If you don't have Docker installed, you can download it from [here](https://docs.docker.com/).
5. Run the `docker-compose up` command to start the application. The API will be accessible at http://localhost:80.

## Technology Stack

- **[Nest.js](https://nestjs.com/)**: a [TypeScript](https://www.typescriptlang.org/)-based Node.js API framework for building efficient, scalable server-side applications.
- **[Postgres](https://www.postgresql.org/)**: a very well known open source object-relational database system.
- **[TypeORM](https://typeorm.io/)**: an ORM built on [TypeScript](https://www.typescriptlang.org/).
- **[Nats](https://nats.io/)**: a lightweight, scalable, and efficient messaging system for building distributed applications.
- **[Nodemailer](https://nodemailer.com/)**: a Node.js module that allows you to send emails from your server with ease.

## Architecture

Film Critics follows a microservices architecture, with each service running in its own Docker container, equipped with a separate database. The API Gateway acts as an intermediary between the client and the microservices, forwarding requests to the appropriate service. A message broker facilitates asynchronous communication between services, allowing data synchronization and triggering specific operations, such as sending emails.

<div align="center">
  <img src="resourses/film-critics-architecture.png" alt="Film Critics Architecture">
</div>

## API Documentation

Explore the API documentation with detailed endpoints and usage examples: [Postman API Documentation](https://documenter.getpostman.com/view/10986690/2s9YJXakff)
