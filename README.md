# SALF - Sistema de Avaliação, Leitura e Fluência (Backend)

API REST para o Sistema de Avaliação, Leitura e Fluência, uma plataforma para gerenciamento e análise de avaliações de leitura.

## Tecnologias Utilizadas

- Node.js
- Express
- Prisma ORM
- MySQL
- Docker
- JWT para autenticação
- Swagger para documentação da API

## Pré-requisitos

- Node.js (versão 14 ou superior)
- Docker e Docker Compose
- NPM ou Yarn

## Instalação e Configuração

1. Clone o repositório:

```bash
git clone [URL_DO_REPOSITORIO]
cd salf-backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

O arquivo `.env` já está configurado com valores padrão para desenvolvimento. Se necessário, ajuste as configurações do banco de dados e o segredo JWT.

4. Inicie o banco de dados MySQL com Docker:

```bash
docker-compose up -d
```

5. Execute as migrações do banco de dados:

```bash
npm run db:migrate
```

6. Popule o banco de dados com dados iniciais:

```bash
npm run db:seed
```

## Executando o Projeto

Para iniciar o servidor em modo de desenvolvimento:

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

Para iniciar em modo de produção:

```bash
npm start
```

## Documentação da API

A documentação da API está disponível através do Swagger UI em:

```
http://localhost:3000/api-docs
```

## Estrutura do Projeto

```
├── docker-compose.yml    # Configuração do Docker para MySQL
├── package.json          # Dependências e scripts
├── prisma/               # Prisma ORM
│   ├── migrations/       # Migrações do banco de dados
│   ├── schema.prisma     # Schema do Prisma
│   └── seed.js           # Script para popular o banco de dados
└── src/                  # Código-fonte
    ├── controllers/      # Controladores
    ├── middleware/       # Middlewares
    ├── routes/           # Rotas da API
    ├── server.js         # Ponto de entrada da aplicação
    └── docs/             # Documentação adicional
```

## Usuários Pré-configurados

O script de seed cria os seguintes usuários para teste:

- **Administrador**
  - Email: admin@salf.edu.br
  - Senha: senha123

- **Coordenador**
  - Email: coordenador@salf.edu.br
  - Senha: senha123

- **Aplicador**
  - Email: aplicador@salf.edu.br
  - Senha: senha123

- **Gestor**
  - Email: gestor@salf.edu.br
  - Senha: senha123

## Endpoints Principais

- **Autenticação:** `/api/auth/login`
- **Usuários:** `/api/usuarios`
- **Escolas:** `/api/escolas`
- **Turmas:** `/api/turmas`
- **Alunos:** `/api/alunos`
- **Avaliações:** `/api/avaliacoes`
- **Eventos de Avaliação:** `/api/eventos-avaliacao`

Consulte a documentação Swagger para detalhes completos sobre todos os endpoints disponíveis.

## Licença

MIT

## Deployment na Vercel

Para fazer o deploy do projeto na Vercel, siga estes passos:

1. Crie uma conta na Vercel (https://vercel.com)
2. Instale a CLI da Vercel: `npm i -g vercel`
3. Faça login na sua conta: `vercel login`
4. Configure as variáveis de ambiente no dashboard da Vercel:
   - `DATABASE_URL`: URL de conexão do banco de dados MySQL
   - `JWT_SECRET`: Chave secreta para geração dos tokens JWT
   - `NODE_ENV`: Deve ser configurado como "production"

5. Execute o comando de deploy: `vercel --prod`

### Requisitos para o Banco de Dados

Para o projeto funcionar corretamente na Vercel, é necessário usar um banco de dados MySQL hospedado externamente. Recomendamos:
- PlanetScale
- Amazon RDS
- Azure Database for MySQL
- Google Cloud SQL 