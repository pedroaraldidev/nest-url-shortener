-- Script de inicialização do PostgreSQL
-- Este script é executado automaticamente quando o container PostgreSQL é criado pela primeira vez

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

SELECT 'PostgreSQL database initialized successfully' as status; 