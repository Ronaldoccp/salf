const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Turma:
 *       type: object
 *       required:
 *         - nome
 *         - escolaId
 *         - anoEscolarId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID da turma
 *         nome:
 *           type: string
 *           description: Nome da turma
 *         escolaId:
 *           type: integer
 *           description: ID da escola
 *         anoEscolarId:
 *           type: integer
 *           description: ID do ano escolar
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
 * /api/turmas:
 *   get:
 *     summary: Retorna todas as turmas
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turmas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turma'
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const turmas = await prisma.turma.findMany({
      include: {
        escola: true,
        anoEscolar: true
      }
    });
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/turmas/{id}:
 *   get:
 *     summary: Retorna uma turma pelo ID
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Detalhes da turma
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turma'
 *       404:
 *         description: Turma não encontrada
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const turma = await prisma.turma.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        escola: true,
        anoEscolar: true,
        alunos: true
      }
    });

    if (!turma) {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }

    res.json(turma);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/turmas:
 *   post:
 *     summary: Cria uma nova turma
 *     tags: [Turmas]
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
 *               - escolaId
 *               - anoEscolarId
 *             properties:
 *               nome:
 *                 type: string
 *               escolaId:
 *                 type: integer
 *               anoEscolarId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nome, escolaId, anoEscolarId } = req.body;

    if (!nome || !escolaId || !anoEscolarId) {
      return res.status(400).json({ error: 'Nome, escola e ano escolar são obrigatórios' });
    }

    const turma = await prisma.turma.create({
      data: {
        nome,
        escolaId: parseInt(escolaId),
        anoEscolarId: parseInt(anoEscolarId)
      }
    });

    res.status(201).json(turma);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/turmas/{id}:
 *   put:
 *     summary: Atualiza uma turma pelo ID
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               escolaId:
 *                 type: integer
 *               anoEscolarId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *       404:
 *         description: Turma não encontrada
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, escolaId, anoEscolarId } = req.body;
    const turmaId = parseInt(req.params.id);

    const turma = await prisma.turma.update({
      where: { id: turmaId },
      data: {
        nome,
        escolaId: escolaId ? parseInt(escolaId) : undefined,
        anoEscolarId: anoEscolarId ? parseInt(anoEscolarId) : undefined
      }
    });

    res.json(turma);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/turmas/{id}:
 *   delete:
 *     summary: Remove uma turma pelo ID
 *     tags: [Turmas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma removida com sucesso
 *       404:
 *         description: Turma não encontrada
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.turma.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Turma removida com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Turma não encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 