// Função serverless para a Vercel
console.log('🚀 Inicializando função serverless');

// Importar dependências necessárias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Carrega as variáveis de ambiente
dotenv.config();

// Importar as rotas
const usuarioRoutes = require('../src/routes/usuarioRoutes');
const authRoutes = require('../src/routes/authRoutes');
const escolaRoutes = require('../src/routes/escolaRoutes');
const regiaoRoutes = require('../src/routes/regiaoRoutes');
const grupoRoutes = require('../src/routes/grupoRoutes');
const turmaRoutes = require('../src/routes/turmaRoutes');
const alunoRoutes = require('../src/routes/alunoRoutes');
const avaliacaoRoutes = require('../src/routes/avaliacaoRoutes');
const eventoAvaliacaoRoutes = require('../src/routes/eventoAvaliacaoRoutes');
const anoEscolarRoutes = require('../src/routes/anoEscolarRoutes');

// Inicialização da aplicação
const app = express();

// Configuração de CORS para permitir acesso de qualquer origem em produção
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Servir arquivos estáticos na raiz
app.use(express.static(path.join(__dirname, '../')));
app.use('/pages', express.static(path.join(__dirname, '../pages')));
app.use('/js', express.static(path.join(__dirname, '../js')));
app.use('/css', express.static(path.join(__dirname, '../css')));

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

// Rota para verificar status do servidor
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Para rotas de frontend, enviar o index.html
app.get('*', (req, res) => {
  // Verificar se a URL é para uma rota da API
  if (req.path.startsWith('/api/') || req.path === '/api' || req.path.startsWith('/api-docs')) {
    // Deixar o roteador da API lidar com isso
    return;
  }
  
  // Para rotas de frontend, enviar o index.html
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error('Erro global:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Ocorreu um erro ao processar sua solicitação'
  });
});

// Exportar o aplicativo Express para a Vercel
module.exports = app; 