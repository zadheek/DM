FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port
EXPOSE 3000

# Development command
CMD ["npm", "run", "dev"]
