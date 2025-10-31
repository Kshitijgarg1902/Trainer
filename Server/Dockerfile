# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# ✅ Generate Prisma client before TypeScript build
RUN npx prisma generate

# Build TypeScript (if you have a build script)
RUN npm run build

# Stage 2: Run
FROM node:20-alpine

WORKDIR /app

# Copy built files and dependencies from build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package*.json ./

# Expose server port
EXPOSE 1234

# ✅ Run migrations, seed, and start server
CMD sh -c "npx prisma migrate deploy && npx ts-node prisma/seed.ts && npm run dev"
