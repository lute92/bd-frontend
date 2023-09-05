# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:18.14-alpine as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG configuration=production
RUN npm run build -- --output-path=./dist/beautyduty-admin --configuration $configuration

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:latest

# Copy default nginx configuration (if needed)
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Copy the compiled app from the build-stage
COPY --from=build-stage /app/dist/beautyduty-admin/ /usr/share/nginx/html

RUN ls -la /usr/share/nginx/html

# EXPOSE 80 (NGINX default HTTP port)
EXPOSE 4200

CMD ["/bin/sh", "-c", "exec nginx -g 'daemon off;';"]
