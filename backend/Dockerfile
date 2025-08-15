FROM node:22.17.0

WORKDIR /expressback

COPY package*.json ./
RUN npm install

COPY . .
CMD ["npm", "run", "dev-watch"]