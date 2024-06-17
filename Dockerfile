# Use the official Node.js image
FROM node:18

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Open port 3000
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
