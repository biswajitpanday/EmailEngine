# EmailEngine
### EmailEngine is a Node.js application

## Features
- Elasticsearch integration: Uses Elasticsearch for full-text search capabilities.
- Flexible repository pattern: Abstract repository base class for different schemas.
- Centralized logging: Utilizes a logger for consistent logging across the application.
- Error handling: Global error handler for managing exceptions.
- Health check: Endpoint to monitor the health of the service.
- Hot reloading: Utilizes `nodemon` for hot reloading during development.

## Prerequisites
- Node.js (v14 or higher)
- Docker

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
    ELASTICSEARCH_HOST=http://localhost:9200
    ```

## Project Structure

````bash
EMAILENGINE/
├── .vscode/
├── dist/
├── logs/
├── node_modules/
├── src/
│   ├── application/
│   │   ├── interfaces/
│   │   │   └── IAuthService.ts
│   │   └── services/
│   │       └── AuthService.ts
│   ├── domain/
│   │   ├── interfaces/
│   │   │   ├── IElasticSearchRepository.ts
│   │   │   ├── IRepositoryBase.ts
│   │   │   └── IUserRepository.ts
│   │   └── models/
│   │       ├── BaseModel.ts
│   │       ├── IPagedResponse.ts
│   │       ├── PagingRequest.ts
│   │       └── UserModel.ts
│   ├── infrastructure/
│   │   ├── config/
│   │   │   ├── ElasticsearchConnection.ts
│   │   ├── di/
│   │   │   ├── container.ts
│   │   │   └── types.ts
│   │   ├── persistence/
│   │   │   ├── documents/
│   │   │   │   └── ElasticSearchDocument.ts
│   │   │   ├── schemas/
│   │   │   │   ├── IBaseModel.ts
│   │   │   │   └── UserSchema.ts
│   │   │   ├── validations/
│   │   │   │   └── BaseValidationSchema.ts
│   │   │   └── repositories/
│   │   │       ├── ElasticSearchRepository.ts
│   │   │       ├── RepositoryBase.ts
│   │   │       └── UserRepository.ts
│   ├── logs/
│   ├── presentation/
│   │   ├── controllers/
│   │   │   ├── AuthController.ts
│   │   │   └── HealthCheckController.ts
│   │   └── routes/
│   │       └── AuthRoutes.ts
│   ├── utils/
│   │   ├── ErrorHandler.ts
│   │   ├── Logger.ts
│   │   ├── ValidateModel.ts
│   │   └── index.ts
├── .dockerignore
├── .env
├── .env.development
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── eslint.config.mjs
├── gitflow.md
├── LICENSE
├── nodemon.json
├── package-lock.json
├── package.json
├── readme.md
├── tsconfig.json
└── tsconfig.tsbuildinfo

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
## Docker Setup
To run the application and its dependencies using Docker:

## Docker Setup

To run the application and its dependencies using Docker:

1. **Build and start the Docker containers:**

    ```bash
    npm run docker:up
    ```

2. **Stop and remove the Docker containers:**

    ```bash
    npm run docker:down
    ```

3. **Clean up Docker resources:**

    ```bash
    npm run docker:prune
    ```

4. **Reset Docker environment:** This will run 2 > 3 > 1 

    ```bash
    npm run docker:reset
    ```



# Health Check

The application provides a health check endpoint to monitor the status of the service, and Elasticsearch.

- Health Check Endpoint: GET /health

## License

This project is licensed under the MIT License.

## Acknowledgements
- [Node.js](https://nodejs.org/en)
- [Elasticsearch](https://www.elastic.co/elasticsearch)

