# Base Docker image
FROM node:14-alpine

# Set up work directory
WORKDIR /usr/src/app

# Copy to Docker
COPY . .

# Install
RUN yarn --frozen-lockfile --production

# Build
RUN yarn build

# Delete src
RUN rm -r ./src

# Run
CMD [ "yarn", "start" ]