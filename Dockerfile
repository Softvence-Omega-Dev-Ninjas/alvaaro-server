FROM node:22-alpine

WORKDIR /app

# Copy the entire project including prisma folder
COPY . .

# Install dependencies
RUN npm install

# Build the app
RUN npm run build

# Optional: ensure Prisma client is generated
RUN npx prisma generate

CMD ["node", "dist/main.js"]
