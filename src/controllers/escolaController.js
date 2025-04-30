const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Listar todas as escolas
 */
const listarEscolas = async (req, res) => {
  try {
    const { regiaoId, grupoId, search } = req.query;
    
    // Construir filtro
    const filtro = {};
    
    if (regiaoId) {
      filtro.regiaoId = Number(regiaoId);
    }
    
    if (grupoId) {
      filtro.grupoId = Number(grupoId);
    }
    
    if (search) {
      filtro.nome = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    const escolas = await prisma.escola.findMany({
      where: filtro,
      include: {
        regiao: true,
        grupo: true,
        turmas: {
          select: {
            id: true,
            nome: true
          }
        },
        _count: {
          select: {
            turmas: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    return res.json(escolas);
  } catch (error) {
    console.error('Erro ao listar escolas:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Buscar uma escola pelo ID
 */
const buscarEscola = async (req, res) => {
  try {
    const { id } = req.params;
    
    const escola = await prisma.escola.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        regiao: true,
        grupo: true,
        turmas: {
          include: {
            anoEscolar: true,
            _count: {
              select: {
                alunos: true
              }
            }
          }
        },
        usuarios: {
          include: {
            usuario: {
              select: {
                id: true,
                nome: true,
                email: true,
                tipo: true
              }
            }
          }
        }
      }
    });
    
    if (!escola) {
      return res.status(404).json({
        error: 'Escola não encontrada'
      });
    }
    
    return res.json(escola);
  } catch (error) {
    console.error('Erro ao buscar escola:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Criar uma nova escola
 */
const criarEscola = async (req, res) => {
  try {
    const { nome, regiaoId, grupoId, usuariosIds = [] } = req.body;
    
    // Validar campos obrigatórios
    if (!nome || !regiaoId) {
      return res.status(400).json({
        error: 'Nome e região são obrigatórios'
      });
    }
    
    // Verificar se a região existe
    const regiaoExiste = await prisma.regiao.findUnique({
      where: {
        id: Number(regiaoId)
      }
    });
    
    if (!regiaoExiste) {
      return res.status(400).json({
        error: 'Região não encontrada'
      });
    }
    
    // Verificar se o grupo existe, se fornecido
    if (grupoId) {
      const grupoExiste = await prisma.grupo.findUnique({
        where: {
          id: Number(grupoId)
        }
      });
      
      if (!grupoExiste) {
        return res.status(400).json({
          error: 'Grupo não encontrado'
        });
      }
    }
    
    // Criar a escola
    const escola = await prisma.escola.create({
      data: {
        nome,
        regiaoId: Number(regiaoId),
        grupoId: grupoId ? Number(grupoId) : null,
        usuarios: {
          create: usuariosIds.map(usuarioId => ({
            usuario: {
              connect: {
                id: Number(usuarioId)
              }
            }
          }))
        }
      },
      include: {
        regiao: true,
        grupo: true
      }
    });
    
    return res.status(201).json(escola);
  } catch (error) {
    console.error('Erro ao criar escola:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Atualizar uma escola existente
 */
const atualizarEscola = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, regiaoId, grupoId, usuariosIds } = req.body;
    
    // Verificar se a escola existe
    const escolaExiste = await prisma.escola.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!escolaExiste) {
      return res.status(404).json({
        error: 'Escola não encontrada'
      });
    }
    
    // Verificar se a região existe, se fornecida
    if (regiaoId) {
      const regiaoExiste = await prisma.regiao.findUnique({
        where: {
          id: Number(regiaoId)
        }
      });
      
      if (!regiaoExiste) {
        return res.status(400).json({
          error: 'Região não encontrada'
        });
      }
    }
    
    // Verificar se o grupo existe, se fornecido
    if (grupoId) {
      const grupoExiste = await prisma.grupo.findUnique({
        where: {
          id: Number(grupoId)
        }
      });
      
      if (!grupoExiste) {
        return res.status(400).json({
          error: 'Grupo não encontrado'
        });
      }
    }
    
    // Preparar dados para atualização
    const dadosAtualizacao = {};
    
    if (nome) dadosAtualizacao.nome = nome;
    if (regiaoId) dadosAtualizacao.regiaoId = Number(regiaoId);
    if (grupoId !== undefined) dadosAtualizacao.grupoId = grupoId ? Number(grupoId) : null;
    
    // Atualizar a escola
    const escola = await prisma.escola.update({
      where: {
        id: Number(id)
      },
      data: dadosAtualizacao,
      include: {
        regiao: true,
        grupo: true
      }
    });
    
    // Se foram enviados IDs de usuários, atualizar as relações
    if (usuariosIds) {
      // Remover todas as relações existentes
      await prisma.escolaUsuario.deleteMany({
        where: {
          escolaId: Number(id)
        }
      });
      
      // Criar novas relações
      for (const usuarioId of usuariosIds) {
        await prisma.escolaUsuario.create({
          data: {
            escolaId: Number(id),
            usuarioId: Number(usuarioId)
          }
        });
      }
    }
    
    return res.json(escola);
  } catch (error) {
    console.error('Erro ao atualizar escola:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

/**
 * Excluir uma escola
 */
const excluirEscola = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a escola existe
    const escolaExiste = await prisma.escola.findUnique({
      where: {
        id: Number(id)
      }
    });
    
    if (!escolaExiste) {
      return res.status(404).json({
        error: 'Escola não encontrada'
      });
    }
    
    // Verificar se há turmas associadas
    const turmasCount = await prisma.turma.count({
      where: {
        escolaId: Number(id)
      }
    });
    
    if (turmasCount > 0) {
      return res.status(400).json({
        error: 'Não é possível excluir esta escola pois ela possui turmas associadas'
      });
    }
    
    // Excluir as relações com usuários
    await prisma.escolaUsuario.deleteMany({
      where: {
        escolaId: Number(id)
      }
    });
    
    // Excluir a escola
    await prisma.escola.delete({
      where: {
        id: Number(id)
      }
    });
    
    return res.json({
      message: 'Escola excluída com sucesso'
    });
  } catch (error) {
    console.error('Erro ao excluir escola:', error);
    
    // Verificar se o erro é de restrição de integridade referencial
    if (error.code === 'P2003') {
      return res.status(400).json({
        error: 'Não é possível excluir esta escola porque ela está vinculada a outros registros no sistema'
      });
    }
    
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

module.exports = {
  listarEscolas,
  buscarEscola,
  criarEscola,
  atualizarEscola,
  excluirEscola
}; 