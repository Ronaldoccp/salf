// Wrapper para o servidor principal para deploy na Vercel
console.log('🚀 Iniciando servidor via api/index.js');

// Importar os controladores para garantir que estejam incluídos no bundle
require('./controllers');

// Importar o aplicativo principal
const app = require('../src/server');

// Exportar o aplicativo para o Vercel
module.exports = app; 