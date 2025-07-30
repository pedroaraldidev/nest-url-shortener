
# Nest URL Shortener API

Sistema de encurtamento de URLs desenvolvido em **NestJS** com autenticação de usuários e contabilização de acessos.

## 🚀 Início Rápido

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Banco de dados (MySQL, PostgreSQL ou SQLite)

### Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
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

- `POST /auth/register` - Cadastro de usuários
- `POST /auth/login` - Autenticação de usuários
- `POST /url/shorten` - Encurtar URL (com ou sem autenticação)
- `GET /:shortCode` - Redirecionamento para URL original

### Endpoints Autenticados

- `GET /url/my-urls` - Listar URLs do usuário
- `PUT /url/:id` - Atualizar URL encurtada
- `DELETE /url/:id` - Excluir URL encurtada

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
├── auth/                 # Autenticação e autorização
├── user/                 # Gerenciamento de usuários
├── url/                  # Lógica de encurtamento
├── common/               # Utilitários compartilhados
│   ├── exceptions/       # Tratamento de erros
│   ├── decorators/       # Decorators customizados
│   └── guards/           # Guards de autenticação
├── config/               # Configurações da aplicação
├── database/             # Configurações do banco
└── main.ts              # Ponto de entrada
```

## 🔒 Segurança

- Autenticação JWT
- Validação de entrada com class-validator
- Senhas criptografadas com bcrypt
- Soft delete para exclusão lógica
- Rate limiting (a ser implementado)

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI em `/api` quando a aplicação estiver rodando.

## 🚧 Próximos Passos

- [ ] Implementar rate limiting
- [ ] Adicionar cache com Redis
- [ ] Implementar observabilidade (logs, métricas, tracing)
- [ ] Configurar CI/CD
- [ ] Deploy em ambiente de produção
