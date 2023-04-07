# Use latest 18th version of node w/ Debian Bullseye
FROM node:18-bullseye-slim

ARG SERVICE_NAME=app

# Environment variables
ENV PATH /app/node_modules/.bin:$PATH

# install simple global static server
RUN npm i --global serve

# copy the common directory
COPY ./common /opt/common

# Set working directory inside the container
WORKDIR /opt/project

# Copy npm files from the host to the container
COPY ${SERVICE_NAME}/package*.json ./

# install packages
RUN npm ci

# copy the rest of the application
COPY ${SERVICE_NAME} ./

# create an optimized production build
RUN npm run build

# serve using a static server
CMD ["serve", "-s", "build"]