# Stage 1: Build stage
FROM node:18 AS build

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Disable strict-ssl
RUN npm config set strict-ssl false

# Install app dependencies with the --legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# Copy the rest of the source code
COPY . .

# Build the TypeScript code
RUN npm run build

# Stage 2: Production stage
FROM node:18 AS production

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy only the necessary files from the build stage
COPY --from=build /usr/src/app/package*.json ./
# COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps

# Open port 3000 and 4040
EXPOSE 3000 4040

# Start the server
CMD ["npm", "run", "start"]
