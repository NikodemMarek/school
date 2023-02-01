FROM php:8.0-apache

COPY ./php /var/www/html/

# RUN apt-get update && apt-get install -y libmariadb-dev
RUN docker-php-ext-install mysqli

EXPOSE 80