const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     AnoEscolar:
 *       type: object
 *       required:
 *         - nome
 *         - nivel
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do ano escolar
 *         nome:
 *           type: string
 *           description: Nome do ano escolar (ex: "1º Ano")
 *         nivel:
 *           type: string
 *           enum: [INFANTIL, FUNDAMENTAL_I, FUNDAMENTAL_II, MEDIO]
 *           description: Nível do ano escolar
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
 * /api/anos-escolares:
 *   get:
 *     summary: Retorna todos os anos escolares
 *     tags: [Anos Escolares]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de anos escolares
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AnoEscolar'
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const anosEscolares = await prisma.anoEscolar.findMany();
    res.json(anosEscolares);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/anos-escolares/{id}:
 *   get:
 *     summary: Retorna um ano escolar pelo ID
 *     tags: [Anos Escolares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ano escolar
 *     responses:
 *       200:
 *         description: Detalhes do ano escolar
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AnoEscolar'
 *       404:
 *         description: Ano escolar não encontrado
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const anoEscolar = await prisma.anoEscolar.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        turmas: true
      }
    });

    if (!anoEscolar) {
      return res.status(404).json({ error: 'Ano escolar não encontrado' });
    }

    res.json(anoEscolar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/anos-escolares:
 *   post:
 *     summary: Cria um novo ano escolar
 *     tags: [Anos Escolares]
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
 *               - nivel
 *             properties:
 *               nome:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum: [INFANTIL, FUNDAMENTAL_I, FUNDAMENTAL_II, MEDIO]
 *     responses:
 *       201:
 *         description: Ano escolar criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nome, nivel } = req.body;

    if (!nome || !nivel) {
      return res.status(400).json({ error: 'Nome e nível são obrigatórios' });
    }

    const anoEscolar = await prisma.anoEscolar.create({
      data: {
        nome,
        nivel
      }
    });

    res.status(201).json(anoEscolar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/anos-escolares/{id}:
 *   put:
 *     summary: Atualiza um ano escolar pelo ID
 *     tags: [Anos Escolares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ano escolar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               nivel:
 *                 type: string
 *                 enum: [INFANTIL, FUNDAMENTAL_I, FUNDAMENTAL_II, MEDIO]
 *     responses:
 *       200:
 *         description: Ano escolar atualizado com sucesso
 *       404:
 *         description: Ano escolar não encontrado
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, nivel } = req.body;
    const anoEscolarId = parseInt(req.params.id);

    const anoEscolar = await prisma.anoEscolar.update({
      where: { id: anoEscolarId },
      data: {
        nome,
        nivel
      }
    });

    res.json(anoEscolar);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Ano escolar não encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/anos-escolares/{id}:
 *   delete:
 *     summary: Remove um ano escolar pelo ID
 *     tags: [Anos Escolares]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do ano escolar
 *     responses:
 *       200:
 *         description: Ano escolar removido com sucesso
 *       404:
 *         description: Ano escolar não encontrado
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.anoEscolar.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Ano escolar removido com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Ano escolar não encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 