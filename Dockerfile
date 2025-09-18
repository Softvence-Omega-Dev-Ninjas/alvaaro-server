FROM node:22-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies without running postinstall scripts
RUN npm ci --ignore-scripts

# Generate Prisma client (without database connection)
RUN npx prisma generate

# Copy the rest of the application
COPY . .

# Build the app
RUN npm run build

CMD ["npm", "run", "start:prod"]
