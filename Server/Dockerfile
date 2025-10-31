# ---------- 1️⃣ Build Stage ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (including dev)
RUN npm ci

# Copy everything
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript → JavaScript
RUN npm run build


# ---------- 2️⃣ Production Stage ----------
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built files, Prisma schema, and production dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Install only production deps
RUN npm ci --omit=dev

# Install Prisma CLI globally (fixes the “not found” issue)
RUN npm install -g prisma

# Expose app port
EXPOSE 1234

# Healthcheck (optional)
HEALTHCHECK --interval=10s --timeout=3s --retries=3 CMD wget -qO- http://localhost:1234 || exit 1

# Run migrations, seed, then start
CMD echo "🚀 Running migrations..." && \
    prisma migrate deploy && \
    echo "🌱 Running seed (JS)..." && \
    node dist/prisma/seed.js || echo "⚠️ Seed failed/skipped" && \
    echo "🟢 Starting server..." && \
    node dist/src/app.js
