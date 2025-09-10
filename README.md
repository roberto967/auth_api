# API de Autenticação com JWT e Express.js

## Sobre o Projeto

API RESTful para autenticação de usuários, implementado com Node.js e
Express.js. O objetivo é ser um sistema de autenticação baseado em JSON Web
Tokens (JWT), com endpoints para registro, login e validação de rotas
protegidas.

---

## Funcionalidades

Registro de Usuários: Endpoint para criar novas contas de usuário com senhas
criptografadas.

Autenticação (Login): Geração de JWT para usuários com credenciais válidas.

Rotas Protegidas: Middleware para verificar a validade do token JWT e proteger
endpoints específicos.

Criptografia de Senhas: Utilização do bcrypt para garantir que as senhas nunca
sejam armazenadas em texto.

---

## Tecnologias Utilizadas

- Node.js
- Express.js
- TypeScript
- jsonwebtoken
- bcrypt.js (biblioteca para criptografia)
- tsyringe (biblioteca para Inversão de Controle (IoC))
- typeORM
- Class-validator/class-transformer
- PostgreSQL

---

## Começando

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente
local.

### Pré-requisitos (Local)

- Node.js (versão 22.x ou superior)
- Yarn
- Banco de dados (PostgreSQL) em execução.

#### Instalação e Execução

##### 1. Clone o repositório

```bash
git clone https://github.com/roberto967/auth_api.git
```

##### 2. Instale as dependências

```bash
yarn install
```

### Pré-requisitos (Docker)
