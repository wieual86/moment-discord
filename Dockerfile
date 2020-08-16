# Base Docker image
FROM node:14-alpine

# Set up work directory
WORKDIR /usr/src/app

# Copies everything over to Docker environment
COPY . .

# Installs all node packages
RUN yarn --frozen-lockfile --production

# Build the application
RUN yarn build

# Finally runs the application
CMD [ "yarn", "start" ]