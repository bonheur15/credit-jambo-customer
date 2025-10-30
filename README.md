# Jambo Credit Customer

This repository contains the source code for the Jambo Credit Customer application, which is a simple system for managing savings accounts with an immutable, append only architecture.

## Project Overview

The project is divided into two main parts:

-   **`backend`**: A Node.js application built with Fastify that provides a secure and robust API for managing user accounts, devices, and transactions.
-   **`frontend`**: A modern web application built with React and Vite that provides a user friendly interface for interacting with the backend API.

## Tech Stack

### Backend

-   **Runtime/Framework**: [Node.js](https://nodejs.org/) with [Fastify](https://www.fastify.io/)
-   **Database**: [PostgreSQL](https://www.postgresql.org/)
-   **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
-   **Authentication**: [jose](https://github.com/panva/jose) for JWT handling
-   **Validation**: [Zod](https://zod.dev/)

### Frontend

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Routing**: [TanStack Router](https://tanstack.com/router/)
-   **Data Fetching**: [TanStack Query](https://tanstack.com/query/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)

## Getting Started

### Prerequisites

-   [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
-   [Node.js](https://nodejs.org/) (v18 or higher)
-   [Bun](https://bun.sh/)

### Installation and Running

1.  **Clone the repository:**

    ```bash
    git https://github.com/bonheur15/credit-jambo-customer.git
    cd credit-jambo-customer
    ```

2.  **Start the services:**

    ```bash
    docker compose up -d
    ```

Or you can install and run them manually

3.  **Install dependencies:**

    ```bash
    # In the root directory
    bun install
    ```

4.  **Run the applications:**

    ```bash
    # For the backend (in the backend directory)
    cd backend
    bun start

    # For the frontend (in the frontend/apps/web directory)
    cd ../frontend/apps/web
    bun dev
    ```

## API Documentation

The backend API is documented using Swagger. You can access the documentation at `http://localhost:4000/documentation` when the backend server is running.

## Immutability

The backend follows an append only approach for data persistence. This means that data is never updated or deleted, only new records are inserted. This is achieved by using an event sourcing like pattern where every change is recorded as an event.
