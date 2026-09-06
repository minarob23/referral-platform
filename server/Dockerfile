FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 4000

# migrations + seed + start are handled by docker-compose command override
CMD ["npm", "start"]
