# Use latest 18th version of node w/ Debian Bullseye
FROM node:18-bullseye-slim

ARG SERVICE_NAME=functions

# Environment variables
ENV PATH /app/node_modules/.bin:$PATH

# copy the common directory
COPY ./common /opt/project/common

# Set working directory inside the container
WORKDIR /opt/project/${SERVICE_NAME}

# Copy npm files from the host to the container
COPY ${SERVICE_NAME}/package*.json ./

# install packages
RUN npm ci

# copy the rest of the functions
COPY ${SERVICE_NAME} ./

# # compile typescript without source maps
RUN npm run compile:prod

# start the function
CMD ["npm", "run", "debug"]