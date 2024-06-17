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
EMAILENGINE/
├── .vscode/
├── dist/
├── node_modules/
├── src/
│ ├── application/
│ │ ├── interfaces/
│ │ │ └── IAuthService.ts
│ │ └── services/
│ │ └── AuthService.ts
│ ├── domain/
│ │ ├── interfaces/
│ │ │ ├── IRepositoryBase.ts
│ │ │ └── IUserRepository.ts
│ │ └── models/
│ │ ├── BaseModel.ts
│ │ ├── IPagedResponse.ts
│ │ ├── PagingRequest.ts
│ │ └── UserModel.ts
│ ├── infrastructure/
│ │ ├── config/
│ │ │ └── MongooseConnection.ts
│ │ ├── di/
│ │ │ ├── container.ts
│ │ │ └── types.ts
│ │ ├── persistence/
│ │ │ ├── schemas/
│ │ │ │ ├── IBaseModel.ts
│ │ │ │ └── UserSchema.ts
│ │ │ ├── validations/
│ │ │ │ └── BaseValidationSchema.ts
│ │ │ └── repositories/
│ │ │ ├── RepositoryBase.ts
│ │ │ └── UserRepository.ts
│ ├── logs/
│ ├── presentation/
│ │ ├── controllers/
│ │ │ ├── AuthController.ts
│ │ │ └── HealthCheckController.ts
│ │ └── routes/
│ │ └── AuthRoutes.ts
│ ├── utils/
│ │ ├── ErrorHandler.ts
│ │ ├── Logger.ts
│ │ └── index.ts
├── .dockerignore
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── gitflow.md
├── LICENSE
├── nodemon.json
├── package-lock.json
├── package.json
├── readme.md
└── tsconfig.json
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
