FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies without running postinstall scripts
RUN npm install --legacy-peer-deps --ignore-scripts

COPY . .

# Generate Prisma client (doesn't need database connection)
RUN npx prisma generate

# Build the application
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:migrate:prod"]