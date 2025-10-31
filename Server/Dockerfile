# -------------------------------
# Stage 1: Build the application
# -------------------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Install TypeScript and ts-node globally for seed + Prisma
RUN npm install -g ts-node typescript

# Generate Prisma client
RUN npx prisma generate

# Build the project (transpile TS -> JS)
RUN npm run build

# -------------------------------
# Stage 2: Run the production build
# -------------------------------
FROM node:20-alpine

WORKDIR /app

# Copy only the built code and node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Install ts-node for Prisma seed scripts
RUN npm install -g ts-node typescript

# Expose the app port
EXPOSE 1234

# Environment
ENV NODE_ENV=production

# Run database migrations + seed + start the server
CMD npx prisma migrate deploy && npx prisma db seed && node dist/app.js
