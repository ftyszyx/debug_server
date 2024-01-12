
FROM node:20.11.0-alpine as development
ENV PROJECT_DIR=/user/src/app
WORKDIR $PROJECT_DIR
COPY package*.json ./
RUN npm config set registry 'https://registry.npmmirror.com'&&npm install
COPY . .
# RUN npm run build

# FROM nginx:1.25.3 as server
# ENV PROJECT_DIR=/user/src/app
# WORKDIR $PROJECT_DIR
# COPY --from=development  $PROJECT_DIR/dist/ /user/share/nginx/html/
