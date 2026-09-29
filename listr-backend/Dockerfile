FROM node:22-alpine
RUN apk add --no-cache curl
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]