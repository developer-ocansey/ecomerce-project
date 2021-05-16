#
# Builder stage.
# This state compile our TypeScript to get the JavaScript code
#

FROM node:12.13.0

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY ./src ./src
RUN yarn install --quiet && yarn build


#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:12.18-alpine3.12

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN yarn install --quiet --only=production

EXPOSE 80

## We just need the build to execute the command
COPY --from=0 /usr/src/app/dist ./dist