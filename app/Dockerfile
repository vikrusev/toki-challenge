# Use latest 18th version of node w/ Debian Bullseye
FROM node:18-bullseye-slim

# install simple global static server
RUN npm i --global serve

ARG SERVICE_NAME=app

# Set working directory inside the container
WORKDIR /opt/project

# Environment variables
ENV PATH /app/node_modules/.bin:$PATH

# Copy the files from the host to the container.
COPY ${SERVICE_NAME}/package*.json ./

# install npm and react versions
RUN npm ci

# copy the common directory
COPY ./common /opt/common

# copy the application
COPY ${SERVICE_NAME} ./

# create an optimized production build
RUN npm run build

# serve using a static server
CMD ["serve", "-s", "build"]