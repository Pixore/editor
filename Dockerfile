FROM node
RUN mkdir -p /app/
WORKDIR /app/
COPY ./package.json /app/
RUN npm install

CMD npm install && npm start