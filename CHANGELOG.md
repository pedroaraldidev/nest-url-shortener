# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Added
- N/A

### Changed
- N/A

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A


## [0.5.0] - 2025-07-30

### Added
- Sistema de contabilização de acessos (clicks)
- Entidade Click para rastreamento de acessos
- Middleware de detecção de IP para rastreamento
- Repositório de clicks com interface TypeORM
- Rastreamento de IP, User-Agent e Referer
- Integração de contabilização no redirecionamento de URLs

### Changed
- Melhorias no sistema de redirecionamento para incluir tracking
- Refatoração do RedirectUrlUseCase para incluir contabilização

## [0.4.0] - 2025-07-30

### Added
- Operações completas de usuário no sistema de encurtamento
- CRUD completo de URLs com autenticação
- Guard de propriedade de URL (UrlOwnershipGuard)
- Endpoints para gerenciar URLs do usuário:
  - `GET /url/my-urls` - Listar URLs do usuário
  - `PUT /url/:id` - Atualizar URL encurtada
  - `DELETE /url/:id` - Excluir URL encurtada
- Sistema de soft delete para URLs
- Validação de propriedade de URLs

### Changed
- Melhorias na estrutura de use cases para operações de URL
- Refatoração dos repositórios para suportar operações de usuário



## [0.3.0] - 2025-07-29

### Added
- Sistema básico de encurtamento de URLs
- Estrutura inicial do projeto NestJS
- Configuração de TypeORM com suporte a múltiplos bancos
- Módulo de usuários com CRUD completo
- Entidades User e Url
- Endpoints públicos para encurtamento:
  - `POST /url/shorten` - Encurtar URL
  - `GET /:shortCode` - Redirecionamento para URL original
- Geração automática de códigos curtos únicos
- Validação de entrada com class-validator
- Documentação Swagger/OpenAPI
- Configuração de ESLint e Prettier
- Scripts de migração e seeds
- Tratamento de exceções customizado


## [0.2.0] - 2025-07-29

### Added
- Suporte completo ao Docker com múltiplas configurações de banco de dados
- Configurações Docker para MySQL, PostgreSQL e SQLite
- Scripts de inicialização de banco de dados
- Documentação Docker detalhada (DOCKER.md)
- Scripts de setup para Windows (PowerShell) e Linux/Mac (Bash)
- Arquivos docker-compose específicos para cada tipo de banco
- Dockerfile multi-stage para otimização de build
- Scripts de setup automático de banco de dados

### Changed
- Melhorias na configuração de ambiente para containers Docker
- Otimização do processo de build e deploy

## [0.1.0] - 2025-07-28

### Added
- Sistema completo de autenticação JWT
- Módulo de autenticação com login
- Guards de autenticação (JwtAuthGuard)
- Guards de autorização (RolesGuard, SelfOrAdminGuard)
- Decorators de autenticação (@Public, @Roles, @SelfOrAdmin)
- Sistema de tokens JWT com expiração
- Validação de credenciais com bcrypt
- Tratamento de exceções de autenticação

### Changed
- Integração do sistema de autenticação com o módulo de URLs
- Melhorias na segurança da aplicação

## [0.0.1] - 2025-07-28

### Added
- Commit inicial do projeto
- Estrutura básica do NestJS
- Configurações de desenvolvimento 