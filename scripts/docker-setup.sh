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
    echo "4) Executar todos os serviços (MySQL + PostgreSQL)"
    echo "5) Parar todos os serviços"
    echo "6) Ver logs"
    echo "7) Limpar tudo (cuidado - apaga dados)"
    echo "8) Sair"
    echo ""
}

# Função para executar com SQLite
run_sqlite() {
    echo "🐳 Executando com SQLite..."
    DB_TYPE=sqlite docker-compose up app
}

# Função para executar com MySQL
run_mysql() {
    echo "🐳 Executando com MySQL..."
    DB_TYPE=mysql docker-compose up
}

# Função para executar com PostgreSQL
run_postgres() {
    echo "🐳 Executando com PostgreSQL..."
    DB_TYPE=postgres docker-compose up
}

# Função para executar todos
run_all() {
    echo "🐳 Executando todos os serviços..."
    docker-compose up
}

# Função para parar serviços
stop_services() {
    echo "🛑 Parando serviços..."
    docker-compose down
    echo "✅ Serviços parados."
}

# Função para ver logs
show_logs() {
    echo "📋 Escolha o serviço para ver logs:"
    echo "1) Aplicação"
    echo "2) MySQL"
    echo "3) PostgreSQL"
    echo "4) Todos"
    read -p "Opção: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f app ;;
        2) docker-compose logs -f mysql ;;
        3) docker-compose logs -f postgres ;;
        4) docker-compose logs -f ;;
        *) echo "❌ Opção inválida" ;;
    esac
}

# Função para limpar tudo
clean_all() {
    echo "⚠️  ATENÇÃO: Isso vai apagar todos os dados!"
    read -p "Tem certeza? (y/N): " confirm
    if [[ $confirm == [yY] ]]; then
        echo "🧹 Limpando tudo..."
        docker-compose down -v
        docker system prune -f
        echo "✅ Limpeza concluída."
    else
        echo "❌ Operação cancelada."
    fi
}

# Menu principal
while true; do
    show_menu
    read -p "Opção: " choice
    
    case $choice in
        1) run_sqlite ;;
        2) run_mysql ;;
        3) run_postgres ;;
        4) run_all ;;
        5) stop_services ;;
        6) show_logs ;;
        7) clean_all ;;
        8) echo "👋 Até logo!"; exit 0 ;;
        *) echo "❌ Opção inválida" ;;
    esac
    
    echo ""
    read -p "Pressione Enter para continuar..."
done 