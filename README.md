# NestJS Demo Project

This is a demo project built with [NestJS](https://nestjs.com/), a progressive Node.js framework for building efficient, reliable and scalable server-side applications.

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Running the app](#running-the-app)
- [Test](#test)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Description

This project demonstrates a basic setup of a NestJS application with modules, controllers, and services. It includes basic CRUD operations and integrates with an external API.

## Installation

To get started with this project, follow the steps below:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/nest-demo.git
    ```

2. Navigate to the project directory:

    ```bash
    cd nest-demo
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Running the app

To run the application, use the following commands:

- Development:

    ```bash
    npm run start
    ```

- Watch mode:

    ```bash
    npm run start:dev
    ```

- Production mode:

    ```bash
    npm run start:prod
    ```

## Test

To run the tests, use the following commands:

- Unit tests:

    ```bash
    npm run test
    ```

- End-to-end tests:

    ```bash
    npm run test:e2e
    ```

- Test coverage:

    ```bash
    npm run test:cov
    ```

## Environment Variables

This project uses environment variables to manage sensitive information. Create a `.env` file in the root directory and add the necessary variables. Here is an example:

```dotenv
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=your-database
OPENAI_API_KEY=your-openai-api-key
