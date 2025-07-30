#!/bin/sh

# Script para configurar o banco de dados baseado na variável DB_TYPE

echo "Setting up database configuration..."

wait_for_db() {
    local db_type=$1
    local host=$2
    local port=$3
    
    echo "Waiting for $db_type to be ready..."
    
    case $db_type in
        mysql)
            while ! nc -z $host $port; do
                echo "Waiting for MySQL at $host:$port..."
                sleep 2
            done
            echo "MySQL is ready!"
            ;;
        postgres)
            while ! nc -z $host $port; do
                echo "Waiting for PostgreSQL at $host:$port..."
                sleep 2
            done
            echo "PostgreSQL is ready!"
            ;;
        sqlite)
            echo "Using SQLite - no external database needed"
            return 0
            ;;
        *)
            echo "Unknown database type: $db_type"
            exit 1
            ;;
    esac
}

# Configurar baseado no tipo de banco
case $DB_TYPE in
    mysql)
        wait_for_db "mysql" "mysql" "3306"
        echo "Running migrations for MySQL..."
        npm run migration:run
        echo "Running seeds for MySQL (will skip if already exists)..."
        npm run seed
        ;;
    postgres)
        wait_for_db "postgres" "postgres" "5432"
        echo "Running migrations for PostgreSQL..."
        npm run migration:run
        echo "Running seeds for PostgreSQL (will skip if already exists)..."
        npm run seed
        ;;
    sqlite)
        echo "Using SQLite database"
        echo "Running migrations for SQLite..."
        npm run migration:run
        echo "Running seeds for SQLite (will skip if already exists)..."
        npm run seed
        ;;
    *)
        echo "Unknown DB_TYPE: $DB_TYPE. Using SQLite as fallback."
        export DB_TYPE=sqlite
        echo "Running migrations for SQLite..."
        npm run migration:run
        echo "Running seeds for SQLite (will skip if already exists)..."
        npm run seed
        ;;
esac

echo "Database setup completed!" 