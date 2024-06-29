# EmailEngine
#### EmailEngine is a Email Synchronization Application.

## Prerequisites
- Node.js (v14 or higher)
- Docker
- Ngrok
- Azure account access
- Azure Admin privileges to register applications

## Installation
    
1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/emailengine.git
    cd emailengine
    ```

2. **Set up environment variables:**

    Create a .env file in the root directory and add the following variables:

    ```env
    NODE_ENV=development
    ELASTICSEARCH_HOST=http://host.docker.internal:9200
    ELASTICSEARCH_USERNAME=elastic
    ELASTICSEARCH_PASSWORD=<your_elasticsearch_password>
    NGROK_AUTHTOKEN=<ngrok_auth_token>
    ```

    Create another .env file in the /backend directory with the following content:

    ```env
    NODE_ENV=development
    CORS_ORIGIN=http://localhost:3001
    PORT=3000
    ELASTICSEARCH_HOST=http://host.docker.internal:9200
    ELASTICSEARCH_USERNAME=elastic
    ELASTICSEARCH_PASSWORD=<your_elasticsearch_password>
    OUTLOOK_CLIENT_ID=<outlook_client_id>
    OUTLOOK_CLIENT_SECRET=<outlook_client_secret>
    NGROK_AUTHTOKEN=<ngrok_auth_token>
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

- Hit the following Url on your browser and provide your microsoft credential and allow requested access.

    ```bash
    http://localhost:3001
    ```

## Steps to Configure Azure

### 1. Register the Backend Application

1. **Navigate to App Registrations**
   - Go to [Azure portal](https://portal.azure.com/).
   - Select "Azure Active Directory" > "App registrations".
   - Click "New registration".

2. **Application Details**
   - **Name**: `Choose a descriptive name for your BACKEND app`
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts".
   - **Redirect URI**: Leave empty for backend configuration.
   - Click "Register".

3. **Expose an API**
   - In "Expose an API", set the **Application ID URI** to `api://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
   - Add a scope with:
     - **Scope name**: `choose a scope name`
     - **Admin consent display name**: "choose an admin consent display name"
     - **User consent display name**: "choose a user consent display name"
   - Click "Add scope".

4. **API Permissions**
   - Under "API permissions", add the following Microsoft Graph permissions:
     - `Mail.Read`
     - `Mail.ReadWrite`
     - `User.Read`
   - Grant admin consent for these permissions.

5. **Generate Client Secret**
   - Go to "Certificates & secrets" and create a new client secret.
   - Note down the secret value; it won't be visible again.

### 2. Register the Frontend Application

1. **Navigate to App Registrations**
   - Go to [Azure portal](https://portal.azure.com/).
   - Select "Azure Active Directory" > "App registrations".
   - Click "New registration".

2. **Application Details**
   - **Name**: `Choose a descriptive name for your FRONTEND app`
   - **Supported account types**: "Accounts in any organizational directory and personal Microsoft accounts".
   - **Redirect URIs**: Add `http://localhost:3001/add-account` for SPA and `http://localhost:3000` for web.
   - Click "Register".

3. **Configure Authentication**
   - Under "Authentication", enable "ID tokens" for single-page applications.

4. **API Permissions**
   - Under "API permissions", add:
     - Microsoft Graph permissions:
       - `Mail.Read`
       - `Mail.ReadWrite`
       - `User.Read`
     - Access to the backend API (`api://xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`):
       - Scope: `Scope name you provided for the backend application`
   - Grant admin consent for these permissions.

5. **Generate Client Secret**
   - Go to "Certificates & secrets" and create a new client secret.
   - Note down the secret value; it won't be visible again.

### 3. Set Up Environment Variables

- In your backend `.env` file, set the following variables:
     ```env
     OUTLOOK_CLIENT_ID=<your_application_client_id>
     OUTLOOK_CLIENT_SECRET=<your_generated_client_secret>
     ```

## FAQ

1. **How to obtain Ngrok Authtoken?**

    To obtain Ngrok Authtoken please Login/Signup on [Ngrok official site](https://ngrok.com/) and find the menu [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) from the dashboard.


## Acknowledgements
- [Node.js](https://nodejs.org/en)
- [Elasticsearch](https://www.elastic.co/elasticsearch)
- [Ngrok](https://ngrok.com/)

