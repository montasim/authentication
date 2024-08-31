# Use the official Node.js 20 Alpine image from Docker Hub.
FROM node:20-alpine AS builder

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Install dependencies only for the build stage.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application's code.
COPY . .

# Build the Next.js application.
RUN yarn build

# Production image
FROM node:20-alpine AS runner

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Copy the build output and necessary files from the build stage.
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/next.config.js ./next.config.js

# Expose the port the app runs on.
EXPOSE 3000

# Command to run the Next.js application.
CMD ["yarn", "start"]
