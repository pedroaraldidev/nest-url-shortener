-- Script de inicialização do MySQL
-- Este script é executado automaticamente quando o container MySQL é criado pela primeira vez

CREATE DATABASE IF NOT EXISTS url_shortener CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE url_shortener;

CREATE USER IF NOT EXISTS 'nest_user'@'%' IDENTIFIED BY 'nest_password';

GRANT ALL PRIVILEGES ON url_shortener.* TO 'nest_user'@'%';
FLUSH PRIVILEGES;

SELECT 'MySQL database initialized successfully' as status; 