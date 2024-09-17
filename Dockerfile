# Use an official Node.js image
FROM node:20.17-alpine AS build

# Define build arguments
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG MONGODB_PASSWORD
ARG MONGO_URI
ARG NEXT_PUBLIC_ECB_API_URL
ARG DB_NAME
ARG UPDATE_TOKENS_ENDPOINT

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

# Start from a fresh Node.js image for the final stage
FROM node:20.17-alpine

# Define environment variables for runtime (optional)
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ENV MONGODB_PASSWORD=${MONGODB_PASSWORD}
ENV MONGO_URI=${MONGO_URI}
ENV NEXT_PUBLIC_ECB_API_URL=${NEXT_PUBLIC_ECB_API_URL}
ENV DB_NAME=${DB_NAME}
ENV UPDATE_TOKENS_ENDPOINT=${UPDATE_TOKENS_ENDPOINT}

# Set the working directory in the container
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app /app

# Expose the port on which the Next.js app will run
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
