FROM node:10.15.3-alpine
LABEL Description="Bridge deCONZ events to MQTT"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
