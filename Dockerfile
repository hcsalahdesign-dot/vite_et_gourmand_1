FROM php:8.2-apache

COPY frontend/ /var/www/html/
COPY backend/ /var/www/html/backend/

RUN a2enmod rewrite

ENV PORT 8080
EXPOSE 8080