# Use latest Node.js LTS version as the base image.
FROM node:latest AS deps

# Set working directory for the application.
WORKDIR /app

# Copy the contents of the node_app directory into the app working
COPY node_app/* /app/

# Run the npm install command to install dependencies defined in package.json.
RUN npm install

# Express app listens on PORT (default 3000 in index.js).
EXPOSE 3000

# Start the server. index.js is the app entry point.
CMD ["npm", "start"]
