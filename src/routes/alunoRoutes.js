const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();
const { authMiddleware } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       required:
 *         - nome
 *         - turmaId
 *       properties:
 *         id:
 *           type: integer
 *           description: ID do aluno
 *         nome:
 *           type: string
 *           description: Nome completo do aluno
 *         dataNascimento:
 *           type: string
 *           format: date
 *           description: Data de nascimento do aluno
 *         matricula:
 *           type: string
 *           description: Número de matrícula do aluno
 *         turmaId:
 *           type: integer
 *           description: ID da turma do aluno
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
 * /api/alunos:
 *   get:
 *     summary: Retorna todos os alunos
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de alunos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Aluno'
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alunos = await prisma.aluno.findMany({
      include: {
        turma: {
          include: {
            escola: true,
            anoEscolar: true
          }
        }
      }
    });
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/alunos/{id}:
 *   get:
 *     summary: Retorna um aluno pelo ID
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Detalhes do aluno
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const aluno = await prisma.aluno.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        turma: {
          include: {
            escola: true,
            anoEscolar: true
          }
        },
        avaliacoes: true
      }
    });

    if (!aluno) {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }

    res.json(aluno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/alunos:
 *   post:
 *     summary: Cria um novo aluno
 *     tags: [Alunos]
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
 *               - turmaId
 *             properties:
 *               nome:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               matricula:
 *                 type: string
 *               turmaId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nome, dataNascimento, matricula, turmaId } = req.body;

    if (!nome || !turmaId) {
      return res.status(400).json({ error: 'Nome e turma são obrigatórios' });
    }

    const aluno = await prisma.aluno.create({
      data: {
        nome,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : null,
        matricula,
        turmaId: parseInt(turmaId)
      }
    });

    res.status(201).json(aluno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/alunos/{id}:
 *   put:
 *     summary: Atualiza um aluno pelo ID
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               dataNascimento:
 *                 type: string
 *                 format: date
 *               matricula:
 *                 type: string
 *               turmaId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nome, dataNascimento, matricula, turmaId } = req.body;
    const alunoId = parseInt(req.params.id);

    const aluno = await prisma.aluno.update({
      where: { id: alunoId },
      data: {
        nome,
        dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
        matricula,
        turmaId: turmaId ? parseInt(turmaId) : undefined
      }
    });

    res.json(aluno);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/alunos/{id}:
 *   delete:
 *     summary: Remove um aluno pelo ID
 *     tags: [Alunos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do aluno
 *     responses:
 *       200:
 *         description: Aluno removido com sucesso
 *       404:
 *         description: Aluno não encontrado
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.aluno.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Aluno removido com sucesso' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Aluno não encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 