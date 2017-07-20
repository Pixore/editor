FROM node
RUN mkdir -p /app/
WORKDIR /app/
COPY . /usr/src/app
RUN npm install

CMD [ "npm", "start" ]