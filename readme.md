# EmailEngine
### EmailEngine is a Node.js application

## Features
- Centralized validation: Uses Joi for validating common properties.
- MongoDB integration: Uses Mongoose for MongoDB interactions.
- Flexible repository pattern: Abstract repository base class for different schemas.
- Centralized logging: Utilizes a logger for consistent logging across the application.
- Error handling: Global error handler for managing exceptions.
- Health check: Endpoint to monitor the health of the service.
- Paging support: Handles paging requests and responses in the repository.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB

## Installation
    
1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/emailengine.git
    cd emailengine
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Set up environment variables:**
Create a .env file in the root directory and add the following variables:

    ```bash
    MONGO_URI_CLOUD=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority&appName=emailenginedb
    ```

## Project Structure

````bash
├── src
│   ├── application
│   │   └── services
│   │       └── AuthService.ts
│   ├── domain
│   │   ├── interfaces
│   │   │   └── IUserRepository.ts
│   │   └── models
│   │       └── UserModel.ts
│   ├── infrastructure
│   │   ├── config
│   │   │   └── MongooseConnection.ts
│   │   ├── persistence
│   │   │   ├── schemas
│   │   │   │   ├── IBaseModel.ts
│   │   │   │   └── UserSchema.ts
│   │   └── repositories
│   │       ├── RepositoryBase.ts
│   │       └── UserRepository.ts
│   ├── presentation
│   │   ├── controllers
│   │   │   └── AuthController.ts
│   │   └── middlewares
│   │       ├── ErrorHandler.ts
│   │       └── HealthCheckController.ts
│   └── utils
│       └── Logger.ts
├── .env
├── package.json
└── README.md
````

## Usage

- To start the application in development mode, use:

    ```bash
    npm run dev
    ```
- To build the project, use:

    ```bash
    npm run build
    ```
- To start the compiled JavaScript code, use:

    ```bash
    npm start
    ```

## License

This project is licensed under the MIT License.

## Acknowledgements
- [Node.js](https://nodejs.org/en)
- [Mongoose](https://mongoosejs.com)
- [Joi](https://joi.dev)
