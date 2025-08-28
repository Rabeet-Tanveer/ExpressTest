FROM node:22.17.0

WORKDIR /expressfront

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start-watch"]