![Logo](https://github.com/jjmirandaa86/learningwords-api/blob/main/img/logo.png)

# Project: Learning Words API (Nodejs, Express)

## Introduction to the RESTful API

This RESTful API was developed using Node.js, Express, and MySQL. It is designed to provide secure and efficient access to data stored in a MySQL database, allowing users to perform operations via token-based authentication.

## Key Features:

- Secure Authentication

  Users must authenticate using a username and password.
  Upon successful authentication, an access token is generated, which must be included in subsequent requests to interact with the endpoints.

- Dynamic Pagination

  The API includes a pagination system to efficiently handle large datasets.
  Users can configure the number of records per page according to their needs, providing a customizable and flexible experience.

- Centralized Configuration

  Sensitive parameters and configuration settings, such as database credentials and the secret key for token generation, are securely stored in a .env file. This simplifies configuration management without exposing sensitive information in the source code.

## Core Functionality:

    - User Registration and Login: Allows users to register and authenticate in the system.
    - Resource Management: Provides endpoints to perform CRUD (Create, Read, Update, Delete) operations on the stored data.
    - Access Tokens: Requires a valid token to be included in the request header (using Authorization: Bearer <token>).
    - Customizable Parameters: Users can define how many records they want to retrieve per page using query parameters.

## API Benefits

    - Scalability: Its modular design and implementation of pagination allow efficient handling of large volumes of data.
    - Security: Token-based authentication ensures that only authorized users can access the resources.
    - Flexibility: Users have control over the amount of data they receive and can adjust the API parameters to suit their needs.

## Tech Stack

**Server:** Nodejs, Express, mySql, Api RESTful.

## .env

To deploy this project run

```bash
NODE_PORT=3000

#mySql
DB_HOST=localhost
DB_USER=userNameDatabase
DB_PASSWD=passwordDatabase
DB=nameDatabase
DB_PORT=3306

#Settings BD
ITEMS_PER_PAGE=3

#JWT
JWT_SECRET_KEY = keySecret
TOKEN_HEADER_KEY = headerSecret

```

## Installation

Install my-project with npm

```bash
  npm install
  cd my-project
  npm start
```

## Authors

- [@jjmirandaa86](https://www.acertijo.dev)

## Demo

![Demo](https://github.com/jjmirandaa86/learningwords-api/blob/main/img/img-vsc-api.png)
