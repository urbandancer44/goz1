FROM nginx
RUN apt-get update && apt-get install -y nano

# Override the default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf