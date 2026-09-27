# Use an official, lightweight Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only package files first (so Docker can cache the npm install layer
# separately from the rest of the code — faster rebuilds when only code changes)
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Now copy the rest of the application code
COPY . .

# Document which port the app listens on (informational; doesn't publish it)
EXPOSE 3000

# Command that runs when a container starts from this image
CMD ["npm", "start"]
