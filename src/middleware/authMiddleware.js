const jwt = require('jsonwebtoken');

/**
 * Middleware para validar o token JWT
 */
const authMiddleware = (req, res, next) => {
  // Obter o token do cabeçalho Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      error: 'Token de autenticação não fornecido'
    });
  }
  
  // O token vem como "Bearer <token>", então precisamos separar
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({
      error: 'Erro no formato do token'
    });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: 'Token mal formatado'
    });
  }
  
  try {
    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Adicionar o usuário à requisição
    req.userId = decoded.id;
    req.userTipo = decoded.tipo;
    
    return next();
  } catch (err) {
    return res.status(401).json({
      error: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar se o usuário tem perfil de administrador
 */
const isAdmin = (req, res, next) => {
  if (req.userTipo !== 'admin') {
    return res.status(403).json({
      error: 'Acesso restrito a administradores'
    });
  }
  
  return next();
};

/**
 * Middleware para verificar se o usuário tem perfil de coordenador ou administrador
 */
const isCoordenadorOrAdmin = (req, res, next) => {
  if (req.userTipo !== 'coordenador' && req.userTipo !== 'admin') {
    return res.status(403).json({
      error: 'Acesso restrito a coordenadores e administradores'
    });
  }
  
  return next();
};

/**
 * Middleware para verificar se o usuário tem perfil de gestor, coordenador ou administrador
 */
const isGestorOrAbove = (req, res, next) => {
  if (req.userTipo !== 'gestor' && req.userTipo !== 'coordenador' && req.userTipo !== 'admin') {
    return res.status(403).json({
      error: 'Acesso restrito a gestores, coordenadores e administradores'
    });
  }
  
  return next();
};

module.exports = {
  authMiddleware,
  isAdmin,
  isCoordenadorOrAdmin,
  isGestorOrAbove
}; 