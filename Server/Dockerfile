# ---------- 1️⃣ Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies
COPY package*.json ./

# Install dependencies (including dev)
RUN npm ci

# Copy the whole project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → JavaScript
RUN npm run build


# ---------- 2️⃣ Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built files and Prisma schema
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Install only production dependencies (this time includes @prisma/client)
RUN npm ci --omit=dev

# Generate Prisma client again (since node_modules is new)
RUN npx prisma generate

# Expose port
EXPOSE 1234

# Run migrations + seed + start server
CMD echo "🚀 Running migrations..." && \
    npx prisma migrate deploy && \
    echo "🌱 Seeding database..." && \
    node dist/prisma/seed.js || echo "⚠️ Seed failed/skipped" && \
    echo "🟢 Starting server..." && \
    node dist/src/app.js
