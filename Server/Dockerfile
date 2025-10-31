# Stage 1: Build
FROM node:18-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build TypeScript (if you have a build script)
RUN npm run build

# Stage 2: Run
FROM node:18-alpine

WORKDIR /app

# Copy node_modules from build stage
COPY --from=build /app/node_modules ./node_modules

# Copy the source code
COPY --from=build /app ./

# Expose server port
EXPOSE 1234

# Run migrations, seed, and start server
CMD sh -c "npx prisma migrate deploy && npx ts-node prisma/seed.ts && npm run dev"
