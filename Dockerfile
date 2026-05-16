FROM php:8.2-apache

# Installation des extensions PDO pour MySQL
RUN docker-php-ext-install pdo pdo_mysql

COPY frontend/ /var/www/html/
COPY backend/ /var/www/html/backend/

RUN a2enmod rewrite

# Optionnel sur Fly.io si vous écoutez sur le port 80, 
# mais on les laisse si vous en avez besoin pour d'autres configurations
ENV PORT 8080
EXPOSE 8080