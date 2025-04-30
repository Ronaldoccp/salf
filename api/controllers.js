// Este arquivo garante que os controladores sejam incluídos no bundle do Vercel
console.log('📦 Carregando controladores...');

try {
  // Importar controladores
  const fs = require('fs');
  const path = require('path');
  
  // Caminho para os controladores
  const controllersPath = path.join(__dirname, '../src/controllers');
  
  // Verificar se o diretório existe
  if (fs.existsSync(controllersPath)) {
    const files = fs.readdirSync(controllersPath);
    
    console.log(`Encontrados ${files.length} controladores:`);
    
    // Importar cada controlador
    files.forEach(file => {
      if (file.endsWith('.js')) {
        console.log(`- ${file}`);
        require(path.join(controllersPath, file));
      }
    });
  } else {
    console.log('Diretório de controladores não encontrado');
  }
} catch (error) {
  console.error('Erro ao carregar controladores:', error);
}

// Exportar objeto vazio para não quebrar outras importações
module.exports = {}; 