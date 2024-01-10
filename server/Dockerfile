FROM node:16.16.0-alpine as development
ENV PROJECT_DIR=/user/src/app
WORKDIR $PROJECT_DIR
COPY package*.json ./
RUN npm config set registry 'https//registry.npmmirror.com/'&&npm install
COPY . .
RUN npm run build

FROM node:16.16.0-alpine as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR $PROJECT_DIR
COPY package*.json ./
RUN npm config set registry 'https//registry.npmmirror.com/'&&npm install --only=production
COPY . .
COPY --from=development  $PROJECT_DIR ./dist
CMD [ "node",'dist/main' ]
EXPOSE 9003
EXPOSE 9004
