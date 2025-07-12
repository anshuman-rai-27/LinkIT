# Use Node.js 21 Alpine as base image
FROM node:21-alpine

# Install dependencies for native modules and database connectivity
RUN apk add --no-cache libc6-compat netcat-openbsd

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Copy source code (including prisma schema) before npm ci
COPY . .

# Install all dependencies (including dev dependencies)
RUN npm ci

# Install dotenv-cli for build-time env usage
RUN npm install -D dotenv-cli

# Generate Prisma client (with .env loaded)
RUN npx dotenv -e .env -- prisma generate

# Expose port
EXPOSE 3000

# Start development server (with .env loaded)
CMD ["npx", "dotenv", "-e", ".env", "--", "npm", "run", "dev"] 