#!/bin/bash

# Script para configurar e executar o projeto com Docker

set -e

echo "🚀 Configurando projeto com Docker..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se o Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Verificar se o arquivo .env existe
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp env.example .env
    echo "✅ Arquivo .env criado. Edite-o conforme necessário."
fi

# Função para mostrar menu
show_menu() {
    echo ""
    echo "🔧 Escolha uma opção:"
    echo "1) Executar com SQLite (desenvolvimento)"
    echo "2) Executar com MySQL"
    echo "3) Executar com PostgreSQL"
    echo "4) Ver logs"
    echo "5) Sair"
    echo ""
}

# Função para executar com SQLite
run_sqlite() {
    echo "🐳 Executando com SQLite..."
    docker-compose -f docker-compose.sqlite.yml up --build
}

# Função para executar com MySQL
run_mysql() {
    echo "🐳 Executando com MySQL..."
    docker-compose -f docker-compose.mysql.yml up --build
}

# Função para executar com PostgreSQL
run_postgres() {
    echo "🐳 Executando com PostgreSQL..."
    docker-compose -f docker-compose.postgres.yml up --build
}

# Função para ver logs
show_logs() {
    echo "📋 Escolha o serviço para ver logs:"
    echo "1) Aplicação (SQLite)"
    echo "2) Aplicação (MySQL)"
    echo "3) Aplicação (PostgreSQL)"
    echo "4) MySQL"
    echo "5) PostgreSQL"
    read -p "Opção: " log_choice
    
    case $log_choice in
        1) docker-compose -f docker-compose.sqlite.yml logs -f app ;;
        2) docker-compose -f docker-compose.mysql.yml logs -f app ;;
        3) docker-compose -f docker-compose.postgres.yml logs -f app ;;
        4) docker-compose -f docker-compose.mysql.yml logs -f mysql ;;
        5) docker-compose -f docker-compose.postgres.yml logs -f postgres ;;
        *) echo "❌ Opção inválida" ;;
    esac
}

# Menu principal
while true; do
    show_menu
    read -p "Opção: " choice
    
    case $choice in
        1) run_sqlite ;;
        2) run_mysql ;;
        3) run_postgres ;;
        4) show_logs ;;
        5) echo "👋 Até logo!"; exit 0 ;;
        *) echo "❌ Opção inválida" ;;
    esac
    
    echo ""
    read -p "Pressione Enter para continuar..."
done 