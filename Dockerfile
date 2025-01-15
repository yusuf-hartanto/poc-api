# Use the official Node.js image to build the application
FROM node:22-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the rest of the application code
COPY . .

COPY wait-for-it.sh /usr/bin/wait-for-it
RUN chmod +x /usr/bin/wait-for-it

# Install dependencies
RUN npm install

# Build the application
RUN npm run build

# Expose port 5000
EXPOSE 5000

# Define the default command
CMD ["npm", "start"]
#CMD ["tail", "-f", "/dev/null"]