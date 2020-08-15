# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:14-alpine

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /usr/src/app

# Copies everything over to Docker environment
COPY . .

# Installs all node packages
RUN yarn --frozen-lockfile --production

# Build the application
RUN yarn build

# Uses port which is used by the actual application
EXPOSE 3000

# Finally runs the application
CMD [ "yarn", "start" ]