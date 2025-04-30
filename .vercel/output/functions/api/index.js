// Função serverless para a Vercel
console.log('🚀 Inicializando função serverless');

// Importar dependências necessárias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

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

// Servir arquivos estáticos da raiz do projeto
app.use(express.static(path.join(__dirname, '../')));

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

// Para rotas de frontend, enviar o arquivo HTML específico ou o index.html como fallback
app.get('*', (req, res) => {
  // Verificar se a URL é para uma rota da API
  if (req.path.startsWith('/api/') || req.path === '/api' || req.path.startsWith('/api-docs')) {
    // Deixar o roteador da API lidar com isso
    return;
  }
  
  const requestPath = req.path === '/' ? '/index.html' : req.path;
  
  // Verificar se é um caminho para um arquivo HTML específico
  if (requestPath.includes('.html')) {
    const htmlPath = path.join(__dirname, '..', requestPath);
    console.log(`Tentando servir HTML específico: ${htmlPath}`);
    
    // Verificar se o arquivo existe
    if (fs.existsSync(htmlPath)) {
      console.log(`✅ Arquivo encontrado: ${htmlPath}`);
      return res.sendFile(htmlPath);
    } else {
      console.log(`❌ Arquivo não encontrado: ${htmlPath}`);
    }
  }
  
  // Verificar se é uma página de seção (pages/algo/...)
  if (requestPath.startsWith('/pages/')) {
    // Extrair o caminho relativo
    const pagePath = path.join(__dirname, '..', requestPath);
    console.log(`Tentando servir página específica: ${pagePath}`);
    
    // Verificar se é um diretório (tentar listar.html por padrão)
    if (!pagePath.endsWith('.html')) {
      const indexPath = path.join(pagePath, 'listar.html');
      if (fs.existsSync(indexPath)) {
        console.log(`✅ Página de listagem encontrada: ${indexPath}`);
        return res.sendFile(indexPath);
      }
    }
    
    // Verificar se o arquivo existe
    if (fs.existsSync(pagePath)) {
      console.log(`✅ Página encontrada: ${pagePath}`);
      return res.sendFile(pagePath);
    } else {
      console.log(`❌ Página não encontrada: ${pagePath}`);
    }
  }
  
  // Fallback para index.html
  console.log('⚠️ Fallback para index.html');
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