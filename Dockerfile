# Use an official Node.js image
FROM node:20.17-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application into the container
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the port on which the Next.js app will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
