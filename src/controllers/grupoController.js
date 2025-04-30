const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Listar todos os grupos
 */
const listarGrupos = async (req, res) => {
  try {
    const { search } = req.query;
    
    // Construir filtro
    const filtro = {};
    
    if (search) {
      filtro.nome = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    const grupos = await prisma.grupo.findMany({
      where: filtro,
      include: {
        _count: {
          select: {
            escolas: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    return res.json(grupos);
  } catch (error) {
    console.error('Erro ao listar grupos:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Buscar um grupo pelo ID
 */
const buscarGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const grupo = await prisma.grupo.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        escolas: {
          select: {
            id: true,
            nome: true,
            regiao: true
          }
        }
      }
    });
    
    if (!grupo) {
      return res.status(404).json({
        error: 'Grupo não encontrado'
      });
    }
    
    return res.json(grupo);
  } catch (error) {
    console.error('Erro ao buscar grupo:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Criar um novo grupo
 */
const criarGrupo = async (req, res) => {
  try {
    const { nome } = req.body;
    
    // Validar campos obrigatórios
    if (!nome) {
      return res.status(400).json({
        error: 'Nome é obrigatório'
      });
    }
    
    // Verificar se já existe um grupo com o mesmo nome
    const grupoExistente = await prisma.grupo.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive'
        }
      }
    });
    
    if (grupoExistente) {
      return res.status(400).json({
        error: 'Já existe um grupo com este nome'
      });
    }
    
    // Criar o grupo
    const grupo = await prisma.grupo.create({
      data: {
        nome
      }
    });
    
    return res.status(201).json(grupo);
  } catch (error) {
    console.error('Erro ao criar grupo:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Atualizar um grupo existente
 */
const atualizarGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    
    // Validar campos obrigatórios
    if (!nome) {
      return res.status(400).json({
        error: 'Nome é obrigatório'
      });
    }
    
    // Verificar se o grupo existe
    const grupoExiste = await prisma.grupo.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!grupoExiste) {
      return res.status(404).json({
        error: 'Grupo não encontrado'
      });
    }
    
    // Verificar se já existe outro grupo com o mesmo nome
    const grupoMesmoNome = await prisma.grupo.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive'
        },
        id: {
          not: Number(id)
        }
      }
    });
    
    if (grupoMesmoNome) {
      return res.status(400).json({
        error: 'Já existe outro grupo com este nome'
      });
    }
    
    // Atualizar o grupo
    const grupo = await prisma.grupo.update({
      where: {
        id: Number(id)
      },
      data: {
        nome
      }
    });
    
    return res.json(grupo);
  } catch (error) {
    console.error('Erro ao atualizar grupo:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Excluir um grupo
 */
const excluirGrupo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se o grupo existe
    const grupoExiste = await prisma.grupo.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!grupoExiste) {
      return res.status(404).json({
        error: 'Grupo não encontrado'
      });
    }
    
    // Verificar se existem escolas associadas a este grupo
    const escolasCount = await prisma.escola.count({
      where: {
        grupoId: Number(id)
      }
    });
    
    if (escolasCount > 0) {
      return res.status(400).json({
        error: 'Não é possível excluir este grupo pois existem escolas associadas a ele'
      });
    }
    
    // Excluir o grupo
    await prisma.grupo.delete({
      where: {
        id: Number(id)
      }
    });
    
    return res.json({
      message: 'Grupo excluído com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir grupo:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  listarGrupos,
  buscarGrupo,
  criarGrupo,
  atualizarGrupo,
  excluirGrupo
}; 