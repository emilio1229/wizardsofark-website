# Simple static site using nginx
FROM nginx:stable-alpine
WORKDIR /usr/share/nginx/html
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/ | head -n 1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
