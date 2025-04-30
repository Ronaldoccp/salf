const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

// Carrega as variáveis de ambiente
dotenv.config();

// Importa as rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const escolaRoutes = require('./routes/escolaRoutes');
const regiaoRoutes = require('./routes/regiaoRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const avaliacaoRoutes = require('./routes/avaliacaoRoutes');
const eventoAvaliacaoRoutes = require('./routes/eventoAvaliacaoRoutes');
const anoEscolarRoutes = require('./routes/anoEscolarRoutes');

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SALF API',
      version: '1.0.0',
      description: 'API do Sistema de Avaliação, Leitura e Fluência',
      contact: {
        name: 'Equipe SALF',
      },
      servers: [
        {
          url: process.env.NODE_ENV === 'production' 
            ? '/api' 
            : `http://localhost:${process.env.PORT || 3000}`,
          description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento',
        },
      ],
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Inicialização da aplicação
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração de CORS para permitir acesso de qualquer origem em produção
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir arquivos estáticos na raiz se estamos em produção
if (process.env.NODE_ENV === 'production') {
  // Caminho absoluto para os arquivos estáticos
  const staticPath = path.join(__dirname, '../');
  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));
}

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/escolas', escolaRoutes);
app.use('/api/regioes', regiaoRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/alunos', alunoRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/eventos-avaliacao', eventoAvaliacaoRoutes);
app.use('/api/anos-escolares', anoEscolarRoutes);

// Rota padrão da API
app.get('/api', (req, res) => {
  res.json({
    message: 'Bem-vindo à API do SALF - Sistema de Avaliação, Leitura e Fluência',
    docsUrl: '/api-docs',
  });
});

// Em produção, roteie todas as outras requisições para o frontend
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    // Verificar se a URL é para uma rota da API
    if (req.path.startsWith('/api/') || req.path === '/api' || req.path.startsWith('/api-docs')) {
      // Deixar o roteador da API lidar com isso
      return;
    }
    
    // Para rotas de frontend, enviar o index.html
    const indexPath = path.join(__dirname, '../index.html');
    console.log(`Serving index.html from: ${indexPath} for path: ${req.path}`);
    res.sendFile(indexPath);
  });
}

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app; 