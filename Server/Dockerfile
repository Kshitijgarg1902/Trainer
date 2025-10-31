# -------------------------------
# Stage 1: Build
# -------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm install -g typescript ts-node

# Generate Prisma client
RUN npx prisma generate

# Compile everything (including seed.ts)
RUN npx tsc

# -------------------------------
# Stage 2: Run
# -------------------------------
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production
EXPOSE 1234

# Run Prisma migration + seed + start server
CMD npx prisma migrate deploy && node dist/prisma/seed.js && node dist/app.js
