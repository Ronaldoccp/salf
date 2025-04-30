const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Avaliacao:
 *       type: object
 *       required:
 *         - alunoId
 *         - eventoAvaliacaoId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da avaliação
 *         alunoId:
 *           type: integer
 *           description: ID do aluno avaliado
 *         eventoAvaliacaoId:
 *           type: integer
 *           description: ID do evento de avaliação
 *         aplicadorId:
 *           type: integer
 *           description: ID do usuário que aplicou a avaliação
 *         dataAplicacao:
 *           type: string
 *           format: date-time
 *           description: Data de aplicação da avaliação
 *         ppm:
 *           type: integer
 *           description: Palavras por minuto
 *         precisao:
 *           type: number
 *           format: float
 *           description: Precisão da leitura (0-100)
 *         prosadia:
 *           type: number
 *           format: float
 *           description: Prosódia da leitura (0-100)
 *         compreensao:
 *           type: number
 *           format: float
 *           description: Compreensão da leitura (0-100)
 *         observacoes:
 *           type: string
 *           description: Observações sobre a avaliação
 *         status:
 *           type: string
 *           enum: [PENDENTE, REALIZADA, CANCELADA]
 *           description: Status da avaliação
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data de atualização
 */

/**
 * @swagger
 * /api/avaliacoes:
 *   get:
 *     summary: Retorna todas as avaliações
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Avaliacao'
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const avaliacoes = await prisma.avaliacao.findMany({
      include: {
        aluno: {
          include: {
            turma: {
              include: {
                escola: true,
                anoEscolar: true
              }
            }
          }
        },
        eventoAvaliacao: true,
        aplicador: true
      }
    });
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/avaliacoes/{id}:
 *   get:
 *     summary: Retorna uma avaliação pelo ID
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Detalhes da avaliação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Avaliacao'
 *       404:
 *         description: Avaliação não encontrada
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        aluno: {
          include: {
            turma: {
              include: {
                escola: true,
                anoEscolar: true
              }
            }
          }
        },
        eventoAvaliacao: true,
        aplicador: true
      }
    });

    if (!avaliacao) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/avaliacoes:
 *   post:
 *     summary: Cria uma nova avaliação
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - alunoId
 *               - eventoAvaliacaoId
 *             properties:
 *               alunoId:
 *                 type: integer
 *               eventoAvaliacaoId:
 *                 type: integer
 *               aplicadorId:
 *                 type: integer
 *               dataAplicacao:
 *                 type: string
 *                 format: date-time
 *               ppm:
 *                 type: integer
 *               precisao:
 *                 type: number
 *               prosadia:
 *                 type: number
 *               compreensao:
 *                 type: number
 *               observacoes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, REALIZADA, CANCELADA]
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      alunoId,
      eventoAvaliacaoId,
      aplicadorId,
      dataAplicacao,
      ppm,
      precisao,
      prosadia,
      compreensao,
      observacoes,
      status
    } = req.body;

    if (!alunoId || !eventoAvaliacaoId) {
      return res.status(400).json({ error: 'Aluno e evento de avaliação são obrigatórios' });
    }

    const avaliacao = await prisma.avaliacao.create({
      data: {
        alunoId: parseInt(alunoId),
        eventoAvaliacaoId: parseInt(eventoAvaliacaoId),
        aplicadorId: aplicadorId ? parseInt(aplicadorId) : null,
        dataAplicacao: dataAplicacao ? new Date(dataAplicacao) : null,
        ppm: ppm ? parseInt(ppm) : null,
        precisao: precisao ? parseFloat(precisao) : null,
        prosadia: prosadia ? parseFloat(prosadia) : null,
        compreensao: compreensao ? parseFloat(compreensao) : null,
        observacoes,
        status: status || 'PENDENTE'
      }
    });

    res.status(201).json(avaliacao);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/avaliacoes/{id}:
 *   put:
 *     summary: Atualiza uma avaliação pelo ID
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               alunoId:
 *                 type: integer
 *               eventoAvaliacaoId:
 *                 type: integer
 *               aplicadorId:
 *                 type: integer
 *               dataAplicacao:
 *                 type: string
 *                 format: date-time
 *               ppm:
 *                 type: integer
 *               precisao:
 *                 type: number
 *               prosadia:
 *                 type: number
 *               compreensao:
 *                 type: number
 *               observacoes:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [PENDENTE, REALIZADA, CANCELADA]
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *       404:
 *         description: Avaliação não encontrada
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const {
      alunoId,
      eventoAvaliacaoId,
      aplicadorId,
      dataAplicacao,
      ppm,
      precisao,
      prosadia,
      compreensao,
      observacoes,
      status
    } = req.body;
    
    const avaliacaoId = parseInt(req.params.id);

    const avaliacao = await prisma.avaliacao.update({
      where: { id: avaliacaoId },
      data: {
        alunoId: alunoId ? parseInt(alunoId) : undefined,
        eventoAvaliacaoId: eventoAvaliacaoId ? parseInt(eventoAvaliacaoId) : undefined,
        aplicadorId: aplicadorId ? parseInt(aplicadorId) : undefined,
        dataAplicacao: dataAplicacao ? new Date(dataAplicacao) : undefined,
        ppm: ppm !== undefined ? parseInt(ppm) : undefined,
        precisao: precisao !== undefined ? parseFloat(precisao) : undefined,
        prosadia: prosadia !== undefined ? parseFloat(prosadia) : undefined,
        compreensao: compreensao !== undefined ? parseFloat(compreensao) : undefined,
        observacoes,
        status
      }
    });

    res.json(avaliacao);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/avaliacoes/{id}:
 *   delete:
 *     summary: Remove uma avaliação pelo ID
 *     tags: [Avaliações]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da avaliação
 *     responses:
 *       200:
 *         description: Avaliação removida com sucesso
 *       404:
 *         description: Avaliação não encontrada
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.avaliacao.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Avaliação removida com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 