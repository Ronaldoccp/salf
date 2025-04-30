const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Autenticar um usuário
 */
const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verificar se o email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios',
      });
    }

    // Buscar o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: {
        email,
      },
    });

    // Verificar se o usuário existe
    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    // Verificar se o usuário está ativo
    if (!usuario.ativo) {
      return res.status(403).json({
        error: 'Usuário inativo. Entre em contato com o administrador.',
      });
    }

    // Verificar a senha
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    );

    // Retornar o token e informações do usuário (sem a senha)
    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      },
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
};

/**
 * Verificar o token e retornar informações do usuário
 */
const verificarToken = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.userId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        error: 'Usuário inativo',
      });
    }

    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor',
    });
  }
};

module.exports = {
  login,
  verificarToken,
}; 