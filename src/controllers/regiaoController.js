const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Listar todas as regiões
 */
const listarRegioes = async (req, res) => {
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
    
    const regioes = await prisma.regiao.findMany({
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
    
    return res.json(regioes);
  } catch (error) {
    console.error('Erro ao listar regiões:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Buscar uma região pelo ID
 */
const buscarRegiao = async (req, res) => {
  try {
    const { id } = req.params;
    
    const regiao = await prisma.regiao.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        escolas: {
          select: {
            id: true,
            nome: true,
            grupo: true
          }
        }
      }
    });
    
    if (!regiao) {
      return res.status(404).json({
        error: 'Região não encontrada'
      });
    }
    
    return res.json(regiao);
  } catch (error) {
    console.error('Erro ao buscar região:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Criar uma nova região
 */
const criarRegiao = async (req, res) => {
  try {
    const { nome } = req.body;
    
    // Validar campos obrigatórios
    if (!nome) {
      return res.status(400).json({
        error: 'Nome é obrigatório'
      });
    }
    
    // Verificar se já existe uma região com o mesmo nome
    const regiaoExistente = await prisma.regiao.findFirst({
      where: {
        nome: {
          equals: nome,
          mode: 'insensitive'
        }
      }
    });
    
    if (regiaoExistente) {
      return res.status(400).json({
        error: 'Já existe uma região com este nome'
      });
    }
    
    // Criar a região
    const regiao = await prisma.regiao.create({
      data: {
        nome
      }
    });
    
    return res.status(201).json(regiao);
  } catch (error) {
    console.error('Erro ao criar região:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Atualizar uma região existente
 */
const atualizarRegiao = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;
    
    // Validar campos obrigatórios
    if (!nome) {
      return res.status(400).json({
        error: 'Nome é obrigatório'
      });
    }
    
    // Verificar se a região existe
    const regiaoExiste = await prisma.regiao.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!regiaoExiste) {
      return res.status(404).json({
        error: 'Região não encontrada'
      });
    }
    
    // Verificar se já existe outra região com o mesmo nome
    const regiaoMesmoNome = await prisma.regiao.findFirst({
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
    
    if (regiaoMesmoNome) {
      return res.status(400).json({
        error: 'Já existe outra região com este nome'
      });
    }
    
    // Atualizar a região
    const regiao = await prisma.regiao.update({
      where: {
        id: Number(id)
      },
      data: {
        nome
      }
    });
    
    return res.json(regiao);
  } catch (error) {
    console.error('Erro ao atualizar região:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Excluir uma região
 */
const excluirRegiao = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a região existe
    const regiaoExiste = await prisma.regiao.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!regiaoExiste) {
      return res.status(404).json({
        error: 'Região não encontrada'
      });
    }
    
    // Verificar se existem escolas associadas a esta região
    const escolasCount = await prisma.escola.count({
      where: {
        regiaoId: Number(id)
      }
    });
    
    if (escolasCount > 0) {
      return res.status(400).json({
        error: 'Não é possível excluir esta região pois existem escolas associadas a ela'
      });
    }
    
    // Excluir a região
    await prisma.regiao.delete({
      where: {
        id: Number(id)
      }
    });
    
    return res.json({
      message: 'Região excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir região:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  listarRegioes,
  buscarRegiao,
  criarRegiao,
  atualizarRegiao,
  excluirRegiao
}; 