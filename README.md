
# Nest URL Shortener API

Sistema de encurtamento de URLs desenvolvido em **NestJS** com autenticação de usuários e contabilização de acessos.

## 📋 Versões e Funcionalidades

### v0.5.0 - Contabilização de Acessos (2025-07-29)
- ✅ Sistema de tracking de clicks
- ✅ Rastreamento de IP, User-Agent e Referer
- ✅ Estatísticas de acesso por URL

### v0.4.0 - Operações de Usuário (2025-07-29)
- ✅ CRUD completo de URLs com autenticação
- ✅ Gerenciamento de URLs por usuário
- ✅ Sistema de propriedade de URLs

### v0.3.0 - Encurtador Básico (2025-07-29)
- ✅ Sistema básico de encurtamento
- ✅ Geração de códigos curtos únicos
- ✅ Redirecionamento de URLs

### v0.2.0 - Suporte Docker (2025-07-29)
- ✅ Suporte completo ao Docker com múltiplas configurações de banco
- ✅ Configurações para MySQL, PostgreSQL e SQLite
- ✅ Scripts de setup automatizado

### v0.1.0 - Autenticação (2025-07-28)
- ✅ Sistema de autenticação JWT
- ✅ Guards de autorização
- ✅ Controle de acesso por roles

## 🚀 Início Rápido

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Banco de dados (MySQL, PostgreSQL ou SQLite)
- [Docker](https://www.docker.com/) (opcional, para v0.2.0+)

### Instalação

#### Opção 1: Docker (Recomendado - v0.2.0+)

1. **Clone o repositório:**
```bash
git clone https://github.com/pedroaraldidev/nest-url-shortener.git
cd nest-url-shortener
```

2. **Execute com Docker:**
```bash
# Para SQLite (desenvolvimento)
docker-compose -f docker-compose.sqlite.yml up

# Para MySQL
docker-compose -f docker-compose.mysql.yml up

# Para PostgreSQL
docker-compose -f docker-compose.postgres.yml up
```

#### Opção 2: Instalação Local

1. **Clone o repositório:**
```bash
git clone https://github.com/pedroaraldidev/nest-url-shortener.git
cd nest-url-shortener
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE=url_shortener
DB_TYPE=mysql

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Application Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000

# URL Shortener Configuration
SHORT_URL_LENGTH=6
BASE_URL=http://localhost:3000
```

4. **Execute as migrações:**
```bash
npm run migration:run
```

5. **Inicie o servidor de desenvolvimento:**
```bash
npm run start:dev
```

### Acessando a Aplicação

- **API**: [http://localhost:3000](http://localhost:3000)
- **Swagger UI**: [http://localhost:3000/api](http://localhost:3000/api)

## 📋 Funcionalidades

### Endpoints Públicos

- `POST /auth/login` - Autenticação de usuários
- `POST /url/shorten` - Encurtar URL (com ou sem autenticação)
- `GET /:shortCode` - Redirecionamento para URL original

### Endpoints Autenticados

- `GET /url/my-urls` - Listar URLs do usuário
- `PUT /url/:id` - Atualizar URL encurtada
- `DELETE /url/:id` - Excluir URL encurtada

### Endpoints de Usuário (Admin)

- `GET /user` - Listar todos os usuários (Admin)
- `GET /user/:id` - Buscar usuário por ID
- `POST /user` - Criar usuário
- `PUT /user/:id` - Atualizar usuário
- `DELETE /user/:id` - Excluir usuário

## 🗄️ Bancos de Dados Suportados

- **MySQL** (recomendado para produção)
- **PostgreSQL** (recomendado para produção)
- **SQLite** (desenvolvimento local)

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes com coverage
npm run test:cov

# Executar testes e2e
npm run test:e2e
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod

# Build
npm run build

# Linting
npm run lint

# Formatação
npm run format

# Migrações
npm run migration:generate
npm run migration:run
npm run migration:revert

# Seeds
npm run seed
```

## 🏗️ Estrutura do Projeto

```
src/
├── auth/                 # Autenticação e autorização (v0.1.0+)
├── user/                 # Gerenciamento de usuários
├── url/                  # Lógica de encurtamento e tracking (v0.3.0+)
├── common/               # Utilitários compartilhados
│   ├── exceptions/       # Tratamento de erros
│   ├── decorators/       # Decorators customizados
│   ├── guards/           # Guards de autenticação
│   ├── middleware/       # Middleware de IP detection (v0.5.0+)
│   └── interceptors/     # Interceptors de transformação
├── config/               # Configurações da aplicação
├── database/             # Configurações do banco
└── main.ts               # Ponto de entrada
```

## 🔒 Segurança

- Autenticação JWT (v0.1.0+)
- Validação de entrada com class-validator
- Senhas criptografadas com bcrypt
- Soft delete para exclusão lógica
- Controle de acesso por roles
- Rate limiting (a ser implementado)

## 📊 Contabilização de Acessos (v0.5.0+)

O sistema rastreia automaticamente:
- **IP Address** - Endereço IP do visitante
- **User-Agent** - Navegador e sistema operacional
- **Referer** - Página de origem (quando disponível)
- **Timestamp** - Data e hora do acesso

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI em `/api` quando a aplicação estiver rodando.

## 🐳 Docker (v0.2.0+)

### Configurações Disponíveis

- **SQLite**: `docker-compose -f docker-compose.sqlite.yml up`
- **MySQL**: `docker-compose -f docker-compose.mysql.yml up`
- **PostgreSQL**: `docker-compose -f docker-compose.postgres.yml up`

### Scripts de Setup

- **Linux/Mac**: `./scripts/docker-setup.sh`
- **Windows**: `.\scripts\docker-setup.ps1`

## 💡 Dicas de Debug

- Se encontrar erros de injeção de dependência, verifique se os módulos necessários estão importados
- Para problemas de autenticação, verifique se o JWT_SECRET está configurado
- Para problemas de banco, verifique as configurações de conexão no .env

## 🛤️ Próximos Passos

- [ ] Implementar rate limiting
- [ ] Adicionar cache com Redis
- [ ] Implementar observabilidade (logs, métricas, tracing)
- [ ] Configurar CI/CD
- [ ] Deploy em ambiente de produção
- [ ] Dashboard de estatísticas
- [ ] API de relatórios de acesso
