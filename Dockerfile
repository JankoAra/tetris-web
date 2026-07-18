FROM nginx:alpine-slim

COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -f /usr/share/nginx/html/nginx.conf \
           /usr/share/nginx/html/Dockerfile \
           /usr/share/nginx/html/docker-compose.yml \
           /usr/share/nginx/html/README.md \
           /usr/share/nginx/html/.gitignore \
           /usr/share/nginx/html/.dockerignore

EXPOSE 80
