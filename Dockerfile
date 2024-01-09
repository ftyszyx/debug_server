From node:16.16.0-alpine as development 
WORKDIR /user/src/app
COPY server/package*.json ./server 
RUN npm install --only=development 
COPY server/ ./server 
RUN npm run build

From node:16.16.0-alpine as production 
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}}
WORKDIR /the/workdir/path
COPY server/package*.json ./server 
RUN npm install --only=production
COPY server/ ./server 
COPY --from=development /user/src/app/dist ./dist 
CMD [ "node",'dist/main' ]