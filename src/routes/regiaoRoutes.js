const express = require('express');
const router = express.Router();
const regiaoController = require('../controllers/regiaoController');
const { authMiddleware, isAdmin, isCoordenadorOrAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/regioes:
 *   get:
 *     summary: Listar regiões
 *     description: Retorna uma lista de todas as regiões
 *     tags: [Regiões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para busca por nome
 *     responses:
 *       200:
 *         description: Lista de regiões
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   _count:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authMiddleware, regiaoController.listarRegioes);

/**
 * @swagger
 * /api/regioes/{id}:
 *   get:
 *     summary: Buscar região por ID
 *     description: Retorna uma região pelo ID
 *     tags: [Regiões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da região
 *     responses:
 *       200:
 *         description: Região encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 escolas:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Região não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', authMiddleware, regiaoController.buscarRegiao);

/**
 * @swagger
 * /api/regioes:
 *   post:
 *     summary: Criar região
 *     description: Cria uma nova região
 *     tags: [Regiões]
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
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Região criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authMiddleware, isCoordenadorOrAdmin, regiaoController.criarRegiao);

/**
 * @swagger
 * /api/regioes/{id}:
 *   put:
 *     summary: Atualizar região
 *     description: Atualiza uma região existente
 *     tags: [Regiões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da região
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Região atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Região não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', authMiddleware, isCoordenadorOrAdmin, regiaoController.atualizarRegiao);

/**
 * @swagger
 * /api/regioes/{id}:
 *   delete:
 *     summary: Excluir região
 *     description: Exclui uma região existente
 *     tags: [Regiões]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da região
 *     responses:
 *       200:
 *         description: Região excluída com sucesso
 *       400:
 *         description: Não é possível excluir a região
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Região não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', authMiddleware, isAdmin, regiaoController.excluirRegiao);

module.exports = router; 