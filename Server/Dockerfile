# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript project (creates /dist)
RUN npm run build

# ---------- RUN STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

# Environment variables are handled by docker-compose / CI secrets
EXPOSE 1234

# Run Prisma migrations, seed, and start the app
CMD npx prisma migrate deploy && \
    npx prisma db seed && \
    node dist/src/app.js
