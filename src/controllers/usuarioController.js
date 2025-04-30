const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

/**
 * Listar todos os usuários
 */
const listarUsuarios = async (req, res) => {
  try {
    const { tipo, ativo, search } = req.query;
    
    // Construir filtro
    const filtro = {};
    
    if (tipo) {
      filtro.tipo = tipo;
    }
    
    if (ativo !== undefined) {
      filtro.ativo = ativo === 'true';
    }
    
    if (search) {
      filtro.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const usuarios = await prisma.usuario.findMany({
      where: filtro,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Buscar um usuário pelo ID
 */
const buscarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(id)
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true,
        escolas: {
          include: {
            escola: true
          }
        }
      }
    });
    
    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }
    
    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Criar um novo usuário
 */
const criarUsuario = async (req, res) => {
  try {
    const { nome, email, senha, tipo, ativo = true, escolasIds = [] } = req.body;
    
    // Validar campos obrigatórios
    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({
        error: 'Nome, email, senha e tipo são obrigatórios'
      });
    }
    
    // Verificar se já existe um usuário com o mesmo email
    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email
      }
    });
    
    if (usuarioExistente) {
      return res.status(400).json({
        error: 'Já existe um usuário com este email'
      });
    }
    
    // Hash da senha
    const hashSenha = await bcrypt.hash(senha, 10);
    
    // Criar o usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashSenha,
        tipo,
        ativo,
        escolas: {
          create: escolasIds.map(escolaId => ({
            escola: {
              connect: {
                id: Number(escolaId)
              }
            }
          }))
        }
      },
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    
    return res.status(201).json(usuario);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Atualizar um usuário existente
 */
const atualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, tipo, ativo, escolasIds } = req.body;
    
    // Verificar se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!usuarioExistente) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }
    
    // Se o email for alterado, verificar se já existe um usuário com o novo email
    if (email && email !== usuarioExistente.email) {
      const emailExistente = await prisma.usuario.findUnique({
        where: {
          email
        }
      });
      
      if (emailExistente) {
        return res.status(400).json({
          error: 'Já existe um usuário com este email'
        });
      }
    }
    
    // Preparar dados para atualização
    const dadosAtualizacao = {};
    
    if (nome) dadosAtualizacao.nome = nome;
    if (email) dadosAtualizacao.email = email;
    if (senha) dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
    if (tipo) dadosAtualizacao.tipo = tipo;
    if (ativo !== undefined) dadosAtualizacao.ativo = ativo;
    
    // Atualizar o usuário
    const usuario = await prisma.usuario.update({
      where: {
        id: Number(id)
      },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });
    
    // Se foram enviados IDs de escolas, atualizar as relações
    if (escolasIds) {
      // Remover todas as relações existentes
      await prisma.escolaUsuario.deleteMany({
        where: {
          usuarioId: Number(id)
        }
      });
      
      // Criar novas relações
      for (const escolaId of escolasIds) {
        await prisma.escolaUsuario.create({
          data: {
            escolaId: Number(escolaId),
            usuarioId: Number(id)
          }
        });
      }
    }
    
    return res.json(usuario);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Excluir um usuário
 */
const excluirUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!usuarioExistente) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      });
    }
    
    // Excluir as relações com escolas
    await prisma.escolaUsuario.deleteMany({
      where: {
        usuarioId: Number(id)
      }
    });
    
    // Excluir o usuário
    await prisma.usuario.delete({
      where: {
        id: Number(id)
      }
    });
    
    return res.json({
      message: 'Usuário excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    
    // Verificar se o erro é de restrição de integridade referencial
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Não é possível excluir este usuário porque ele está vinculado a outros registros no sistema'
      });
    }
    
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  listarUsuarios,
  buscarUsuario,
  criarUsuario,
  atualizarUsuario,
  excluirUsuario
}; 