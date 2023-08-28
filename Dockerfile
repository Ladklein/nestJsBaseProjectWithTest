# ! Important
# Since we rely in our code to environment variables for e.g. db connection
# this can only be run successfully with docker-compose file

# Specify node version and choose image
# also user our image as development (can be anything)
FROM node:18.16-alpine AS development

# Specify our working directory, this is in our container/in our image
WORKDIR /mapTourist/user/

# Copy the package.jsons from host to container
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY ./package*.json ./

# Here we install all the deps
RUN npm install

# Bundle app source / copy all other files
COPY / .

# Build the app to the /dist folder
RUN npm run build

################
## PRODUCTION ##
################
# Build another image named production
FROM node:18.16-alpine AS production

# Set node env to prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set Working Directory
WORKDIR /mapTourist/user/

# Copy all from development stage
COPY --from=development /mapTourist/user/ .

EXPOSE 3000

# Run app
CMD [ "npm", "start"]

# Example Commands to build and run the dockerfile
# docker build -t marker .
# docker run marker