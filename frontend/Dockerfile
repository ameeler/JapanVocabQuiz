# Step 1: Build the React application
FROM node:18-alpine
WORKDIR /frontend/

# These instructions will copy the files we need into the working directory
COPY public/ /frontend/public
COPY src/ /frontend/src
COPY package.json /frontend/

RUN npm install --legacy-peer-deps

# There can only be one CMD instruction in the Dockerfile
CMD ["npm", "start"]