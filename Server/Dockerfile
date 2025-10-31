# ---------- 1️⃣ Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (including dev)
RUN npm ci

# Copy entire source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → JavaScript
RUN npm run build


# ---------- 2️⃣ Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built output, prisma schema, and essential files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Install only production dependencies
RUN npm ci --omit=dev

# Expose your app port
EXPOSE 1234

# Add optional health check
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD curl -f http://localhost:1234 || exit 1

# Run migrations, seed (JS), and start app
CMD echo "🚀 Running migrations..." && \
    npx prisma migrate deploy || true && \
    echo "🌱 Running JS seed file..." && \
    node dist/prisma/seed.js || echo "⚠️ Seeding skipped (possibly no data)" && \
    echo "🟢 Starting server..." && \
    node dist/src/app.js
