// Middleware para redirecionamento de arquivos estáticos
module.exports = async (req, res, next) => {
  const path = req.url.split('?')[0];
  
  console.log(`Middleware processando: ${path}`);
  
  // Verificar se é uma requisição para um arquivo estático
  if (
    path.endsWith('.html') || 
    path.startsWith('/js/') || 
    path.startsWith('/css/') || 
    path.startsWith('/pages/')
  ) {
    console.log(`Servindo arquivo estático: ${path}`);
    // Continuar para o próximo middleware ou rota
    return next();
  }
  
  // Para requisições da API
  if (path.startsWith('/api/')) {
    console.log(`Processando requisição de API: ${path}`);
    return next();
  }
  
  // Para outras rotas, continue normalmente
  return next();
}; 