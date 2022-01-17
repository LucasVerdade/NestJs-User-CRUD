FROM node:alpine

# create destination directory
RUN mkdir -p /usr/src/node-api
WORKDIR /usr/src/node-api

# copy the app, note .dockerignore
COPY . /usr/src/node-api/
RUN npm install

# expose 3000 on container
EXPOSE 3000

# start the app
CMD [ "npm","run", "start:dev" ]