# Docker Setup

Este projeto inclui configuração completa do Docker com suporte a múltiplos bancos de dados.

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp env.example .env
```

Edite o `.env` para configurar o banco de dados desejado:

#### Para SQLite (padrão):
```env
DB_TYPE=sqlite
```

#### Para MySQL:
```env
DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=nest_user
DB_PASSWORD=nest_password
DB_NAME=url_shortener
```

#### Para PostgreSQL:
```env
DB_TYPE=postgres
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=nest_user
DB_PASSWORD=nest_password
DB_NAME=url_shortener
```

### 2. Executando com Docker Compose

#### Desenvolvimento (com hot reload):
```bash
docker-compose up
```

#### Produção:
```bash
docker-compose -f docker-compose.yml up
```

#### Apenas com SQLite (sem bancos externos):
```bash
DB_TYPE=sqlite docker-compose up app
```

## Estrutura do Docker

### Serviços

- **app**: Aplicação NestJS
- **mysql**: Banco MySQL 8.0 (porta 3306)
- **postgres**: Banco PostgreSQL 15 (porta 5432)

### Redes

- **internal**: Rede interna para comunicação entre containers
- Os bancos de dados só são acessíveis via rede interna

### Volumes

- **mysql_data**: Dados persistentes do MySQL
- **postgres_data**: Dados persistentes do PostgreSQL
- **./database.sqlite**: Arquivo SQLite (para desenvolvimento)

## Scripts de Inicialização

### MySQL (`docker/mysql/init.sql`)
- Cria o banco `url_shortener`
- Configura usuário `nest_user`
- Define privilégios necessários

### PostgreSQL (`docker/postgres/init.sql`)
- Cria extensões necessárias
- O banco é criado automaticamente pelo `POSTGRES_DB`

### Aplicação (`docker/scripts/setup-db.sh`)
- Aguarda o banco estar pronto
- Executa migrations
- Executa seeds
- Inicia a aplicação

## Comandos Úteis

### Ver logs:
```bash
docker-compose logs -f app
```

### Executar migrations:
```bash
docker-compose exec app npm run migration:run
```

### Executar seeds:
```bash
docker-compose exec app npm run seed
```

### Acessar banco MySQL:
```bash
docker-compose exec mysql mysql -u nest_user -p url_shortener
```

### Acessar banco PostgreSQL:
```bash
docker-compose exec postgres psql -U nest_user -d url_shortener
```

### Parar todos os serviços:
```bash
docker-compose down
```

### Remover volumes (cuidado - apaga dados):
```bash
docker-compose down -v
```

## Segurança

- Os bancos de dados só são acessíveis via rede interna
- Credenciais padrão devem ser alteradas em produção
- JWT_SECRET deve ser alterado em produção
- Volumes garantem persistência dos dados

## Troubleshooting

### Banco não conecta:
1. Verifique se o container do banco está rodando: `docker-compose ps`
2. Verifique logs: `docker-compose logs mysql` ou `docker-compose logs postgres`
3. Aguarde alguns segundos para inicialização completa

### Migrations falham:
1. Verifique se o banco está pronto
2. Execute manualmente: `docker-compose exec app npm run migration:run`

### Aplicação não inicia:
1. Verifique logs: `docker-compose logs app`
2. Verifique variáveis de ambiente no `.env`
3. Verifique conectividade com o banco 