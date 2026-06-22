FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY src ./src
COPY docs ./docs
EXPOSE 5000
CMD ["npm", "start"]
