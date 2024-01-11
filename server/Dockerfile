FROM node:20.11.0-alpine as development
ENV PROJECT_DIR=/user/src/app
WORKDIR $PROJECT_DIR
COPY package*.json ./
RUN npm config set registry 'https://registry.npmmirror.com'&&npm install
COPY . .
RUN npm run build

FROM node:20.11.0-alpine as production
ENV PROJECT_DIR=/user/src/app
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR $PROJECT_DIR
COPY package*.json ./
RUN npm config set registry 'https://registry.npmmirror.com'&&npm install --omit=dev
COPY . .
RUN rm -rf src/
COPY --from=development  $PROJECT_DIR/dist ./dist
# CMD [ "node",'dist/main' ]
EXPOSE 9003
EXPOSE 9004
