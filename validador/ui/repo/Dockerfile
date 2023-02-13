FROM node:16-alpine as build
WORKDIR /app/repo/code
ENV PATH /app/repo/code/node_modules/.bin:$PATH
COPY ./repo/code/package.json .
RUN npm install --force
COPY ./repo/code/public ./public/
COPY ./repo/code/src ./src/
COPY ./configs/Configs.json ./src/configs/Configs.json
RUN npm run build

FROM nginx:stable-alpine
COPY ./repo/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/repo/code/build /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]
