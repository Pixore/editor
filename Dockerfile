FROM node
RUN mkdir -p /app/
WORKDIR /app/
COPY ./package.json /app/

CMD npm start