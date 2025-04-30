// Script para preparar a estrutura de build para a Vercel
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando arquivos para deploy na Vercel...');

// Diretórios de saída Vercel
const vercelDir = path.join(__dirname, '../.vercel');
const outputDir = path.join(vercelDir, 'output');
const staticDir = path.join(outputDir, 'static');
const pagesDir = path.join(staticDir, 'pages');

// Garantir que os diretórios existam
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Criando diretório: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(vercelDir);
ensureDir(outputDir);
ensureDir(staticDir);
ensureDir(pagesDir);

// Função para copiar arquivos recursivamente
function copyFilesRecursively(source, destination) {
  if (!fs.existsSync(source)) {
    console.log(`❌ Diretório de origem não existe: ${source}`);
    return;
  }
  
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }
  
  const items = fs.readdirSync(source);
  
  for (const item of items) {
    const sourcePath = path.join(source, item);
    const destPath = path.join(destination, item);
    
    const stat = fs.statSync(sourcePath);
    
    if (stat.isDirectory()) {
      copyFilesRecursively(sourcePath, destPath);
    } else {
      try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Arquivo copiado: ${sourcePath} -> ${destPath}`);
      } catch (error) {
        console.error(`❌ Erro ao copiar ${sourcePath}: ${error.message}`);
      }
    }
  }
}

// Copiar arquivos HTML e recursos estáticos
console.log('📄 Copiando arquivos HTML e recursos estáticos...');

// Copiar index.html para a raiz do diretório static
if (fs.existsSync(path.join(__dirname, '../index.html'))) {
  fs.copyFileSync(
    path.join(__dirname, '../index.html'),
    path.join(staticDir, 'index.html')
  );
  console.log('✅ index.html copiado para o diretório static');
}

// Copiar páginas
if (fs.existsSync(path.join(__dirname, '../pages'))) {
  copyFilesRecursively(
    path.join(__dirname, '../pages'),
    path.join(staticDir, 'pages')
  );
  console.log('✅ Diretório pages copiado para o diretório static');
}

// Copiar arquivos JS
if (fs.existsSync(path.join(__dirname, '../js'))) {
  copyFilesRecursively(
    path.join(__dirname, '../js'),
    path.join(staticDir, 'js')
  );
  console.log('✅ Diretório js copiado para o diretório static');
}

// Copiar arquivos CSS
if (fs.existsSync(path.join(__dirname, '../css'))) {
  copyFilesRecursively(
    path.join(__dirname, '../css'),
    path.join(staticDir, 'css')
  );
  console.log('✅ Diretório css copiado para o diretório static');
}

// Criar o arquivo de função serverless
const functionDir = path.join(outputDir, 'functions/api/index.js');
ensureDir(path.dirname(functionDir));

// Copiar o arquivo api/index.js para o diretório functions
fs.copyFileSync(
  path.join(__dirname, 'index.js'),
  functionDir
);
console.log('✅ api/index.js copiado para o diretório functions');

// Verificar ou criar o arquivo de configuração
const configPath = path.join(outputDir, 'config.json');
if (!fs.existsSync(configPath)) {
  const config = {
    "version": 3,
    "routes": [
      { "src": "/js/(.*)", "dest": "/js/$1" },
      { "src": "/css/(.*)", "dest": "/css/$1" },
      { "src": "/pages/(.*\\.html)", "dest": "/pages/$1" },
      { "src": "/pages/(.*)", "dest": "/api/index.js" },
      { "src": "/api/(.*)", "dest": "/api/index.js" },
      { "src": "/(.*\\.html)", "dest": "/$1.html" },
      { "src": "/(.*)", "dest": "/api/index.js" }
    ]
  };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log('✅ Arquivo de configuração criado');
}

console.log('🎉 Configuração para Vercel concluída!'); 