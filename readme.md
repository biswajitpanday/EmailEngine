# EmailEngine
#### EmailEngine is a Email Synchronization Application.

## Prerequisites
- Node.js (v14 or higher)
- Docker
- Ngrok

## Installation
    
1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/emailengine.git
    cd emailengine
    ```

2. **Set up environment variables:**

    Create a .env file in the root directory and add the following variables:

    ```bash
    NODE_ENV=development
    ELASTICSEARCH_HOST=http://host.docker.internal:9200
    ELASTICSEARCH_USERNAME=elastic
    ELASTICSEARCH_PASSWORD=your_elasticsearch_password
    NGROK_AUTHTOKEN=ngrok_auth_token
    ```

    Create another .env file in the /backend directory with the following content:

    ```bash
    NODE_ENV=development
    CORS_ORIGIN=http://localhost:3001
    PORT=3000
    ELASTICSEARCH_HOST=http://host.docker.internal:9200
    ELASTICSEARCH_USERNAME=elastic
    ELASTICSEARCH_PASSWORD=your_elasticsearch_password
    OUTLOOK_CLIENT_ID=outlook_client_id
    OUTLOOK_CLIENT_SECRET=outlook_client_secret
    NGROK_AUTHTOKEN=ngrok_auth_token
    ```

3. **Build and start the Docker containers:**

    ```bash
    npm run docker:up
    ```

4. **Stop and remove the Docker containers:**

    ```bash
    npm run docker:down
    ```

5. **Clean up Docker resources:**

    ```bash
    npm run docker:prune
    ```

6. **Reset Docker environment:** 

    Master Command. This will run => (npm run docker:down && npm run docker:prune && npm run docker:up)

    ```bash
    npm run docker:reset
    ```

## How to Run

Go to the following Url and provide your microsoft credential and allow requested access.

```bash
http://localhost:3001
```

## Acknowledgements
- [Node.js](https://nodejs.org/en)
- [Elasticsearch](https://www.elastic.co/elasticsearch)
- [Ngrok](https://ngrok.com/)

