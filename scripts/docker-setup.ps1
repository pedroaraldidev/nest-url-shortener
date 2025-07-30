# Script PowerShell para configurar e executar o projeto com Docker

Write-Host "Configurando projeto com Docker..." -ForegroundColor Green

# Verificar se o Docker esta instalado
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker nao esta instalado. Por favor, instale o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o Docker Compose esta instalado
if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "Docker Compose nao esta instalado. Por favor, instale o Docker Compose primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se o arquivo .env existe
if (!(Test-Path .env)) {
    Write-Host "Criando arquivo .env..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Arquivo .env criado. Edite-o conforme necessario." -ForegroundColor Green
}

# Funcao para mostrar menu
function Show-Menu {
    Write-Host ""
    Write-Host "Escolha uma opcao:" -ForegroundColor Cyan
    Write-Host "1) Executar com SQLite (desenvolvimento)"
    Write-Host "2) Executar com MySQL"
    Write-Host "3) Executar com PostgreSQL"
    Write-Host "4) Ver logs"
    Write-Host "5) Sair"
    Write-Host ""
}

# Funcao para executar com SQLite
function Run-SQLite {
    Write-Host "Executando com SQLite..." -ForegroundColor Green
    Write-Host "Usando configuracao especifica para SQLite (sem bancos externos)" -ForegroundColor Yellow
    docker-compose -f docker-compose.sqlite.yml up --build
}

# Funcao para executar com MySQL
function Run-MySQL {
    Write-Host "Executando com MySQL..." -ForegroundColor Green
    Write-Host "Usando configuracao especifica para MySQL" -ForegroundColor Yellow
    docker-compose -f docker-compose.mysql.yml up --build
}

# Funcao para executar com PostgreSQL
function Run-PostgreSQL {
    Write-Host "Executando com PostgreSQL..." -ForegroundColor Green
    Write-Host "Usando configuracao especifica para PostgreSQL" -ForegroundColor Yellow
    docker-compose -f docker-compose.postgres.yml up --build
}

# Funcao para ver logs
function Show-Logs {
    Write-Host "Escolha o servico para ver logs:" -ForegroundColor Cyan
    Write-Host "1) Aplicacao (SQLite)"
    Write-Host "2) Aplicacao (MySQL)"
    Write-Host "3) Aplicacao (PostgreSQL)"
    Write-Host "4) MySQL"
    Write-Host "5) PostgreSQL"
    $logChoice = Read-Host "Opcao"
    
    switch ($logChoice) {
        "1" { docker-compose -f docker-compose.sqlite.yml logs -f app }
        "2" { docker-compose -f docker-compose.mysql.yml logs -f app }
        "3" { docker-compose -f docker-compose.postgres.yml logs -f app }
        "4" { docker-compose -f docker-compose.mysql.yml logs -f mysql }
        "5" { docker-compose -f docker-compose.postgres.yml logs -f postgres }
        default { Write-Host "Opcao invalida" -ForegroundColor Red }
    }
}

# Menu principal
do {
    Show-Menu
    $choice = Read-Host "Opcao"
    
    switch ($choice) {
        "1" { Run-SQLite }
        "2" { Run-MySQL }
        "3" { Run-PostgreSQL }
        "4" { Show-Logs }
        "5" { Write-Host "Ate logo!" -ForegroundColor Green; exit 0 }
        default { Write-Host "Opcao invalida" -ForegroundColor Red }
    }
    
    Write-Host ""
    Read-Host "Pressione Enter para continuar"
} while ($true)
