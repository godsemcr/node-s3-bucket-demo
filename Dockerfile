FROM node:18-alpine

# Set the working directory inside container
WORKDIR /app

# Copy dependency files and install
COPY package*.json ./
RUN npm install --production

# Copy rest of project
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["node", "src/server.js"]
