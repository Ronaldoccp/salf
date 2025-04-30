const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     EventoAvaliacao:
 *       type: object
 *       required:
 *         - nome
 *         - dataInicio
 *         - dataFim
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do evento de avaliação
 *         nome:
 *           type: string
 *           description: Nome do evento de avaliação
 *         descricao:
 *           type: string
 *           description: Descrição do evento
 *         dataInicio:
 *           type: string
 *           format: date
 *           description: Data de início do evento
 *         dataFim:
 *           type: string
 *           format: date
 *           description: Data de término do evento
 *         status:
 *           type: string
 *           enum: [PLANEJADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *           description: Status do evento
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
 * /api/eventos-avaliacao:
 *   get:
 *     summary: Retorna todos os eventos de avaliação
 *     tags: [Eventos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos de avaliação
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventoAvaliacao'
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const eventos = await prisma.eventoAvaliacao.findMany({
      include: {
        avaliacoes: true
      }
    });
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/eventos-avaliacao/{id}:
 *   get:
 *     summary: Retorna um evento de avaliação pelo ID
 *     tags: [Eventos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento de avaliação
 *     responses:
 *       200:
 *         description: Detalhes do evento de avaliação
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventoAvaliacao'
 *       404:
 *         description: Evento de avaliação não encontrado
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const evento = await prisma.eventoAvaliacao.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        avaliacoes: {
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
            aplicador: true
          }
        }
      }
    });

    if (!evento) {
      return res.status(404).json({ error: 'Evento de avaliação não encontrado' });
    }

    res.json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/eventos-avaliacao:
 *   post:
 *     summary: Cria um novo evento de avaliação
 *     tags: [Eventos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - dataInicio
 *               - dataFim
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date
 *               dataFim:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PLANEJADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *     responses:
 *       201:
 *         description: Evento de avaliação criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nome, descricao, dataInicio, dataFim, status } = req.body;

    if (!nome || !dataInicio || !dataFim) {
      return res.status(400).json({ error: 'Nome, data de início e data de fim são obrigatórios' });
    }

    const evento = await prisma.eventoAvaliacao.create({
      data: {
        nome,
        descricao,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        status: status || 'PLANEJADO'
      }
    });

    res.status(201).json(evento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/eventos-avaliacao/{id}:
 *   put:
 *     summary: Atualiza um evento de avaliação pelo ID
 *     tags: [Eventos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento de avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               dataInicio:
 *                 type: string
 *                 format: date
 *               dataFim:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [PLANEJADO, EM_ANDAMENTO, CONCLUIDO, CANCELADO]
 *     responses:
 *       200:
 *         description: Evento de avaliação atualizado com sucesso
 *       404:
 *         description: Evento de avaliação não encontrado
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, descricao, dataInicio, dataFim, status } = req.body;
    const eventoId = parseInt(req.params.id);

    const evento = await prisma.eventoAvaliacao.update({
      where: { id: eventoId },
      data: {
        nome,
        descricao,
        dataInicio: dataInicio ? new Date(dataInicio) : undefined,
        dataFim: dataFim ? new Date(dataFim) : undefined,
        status
      }
    });

    res.json(evento);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Evento de avaliação não encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/eventos-avaliacao/{id}:
 *   delete:
 *     summary: Remove um evento de avaliação pelo ID
 *     tags: [Eventos de Avaliação]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do evento de avaliação
 *     responses:
 *       200:
 *         description: Evento de avaliação removido com sucesso
 *       404:
 *         description: Evento de avaliação não encontrado
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.eventoAvaliacao.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Evento de avaliação removido com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Evento de avaliação não encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 