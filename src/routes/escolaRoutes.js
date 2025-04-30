const express = require('express');
const router = express.Router();
const escolaController = require('../controllers/escolaController');
const { authMiddleware, isAdmin, isCoordenadorOrAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/escolas:
 *   get:
 *     summary: Listar escolas
 *     description: Retorna uma lista de todas as escolas
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: regiaoId
 *         schema:
 *           type: integer
 *         description: Filtrar por região
 *       - in: query
 *         name: grupoId
 *         schema:
 *           type: integer
 *         description: Filtrar por grupo
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto para busca por nome
 *     responses:
 *       200:
 *         description: Lista de escolas
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
 *                   regiaoId:
 *                     type: integer
 *                   regiao:
 *                     type: object
 *                   grupoId:
 *                     type: integer
 *                   grupo:
 *                     type: object
 *                   turmas:
 *                     type: array
 *                     items:
 *                       type: object
 *                   _count:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', authMiddleware, escolaController.listarEscolas);

/**
 * @swagger
 * /api/escolas/{id}:
 *   get:
 *     summary: Buscar escola por ID
 *     description: Retorna uma escola pelo ID
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da escola
 *     responses:
 *       200:
 *         description: Escola encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 regiaoId:
 *                   type: integer
 *                 regiao:
 *                   type: object
 *                 grupoId:
 *                   type: integer
 *                 grupo:
 *                   type: object
 *                 turmas:
 *                   type: array
 *                   items:
 *                     type: object
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Escola não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/:id', authMiddleware, escolaController.buscarEscola);

/**
 * @swagger
 * /api/escolas:
 *   post:
 *     summary: Criar escola
 *     description: Cria uma nova escola
 *     tags: [Escolas]
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
 *               - regiaoId
 *             properties:
 *               nome:
 *                 type: string
 *               regiaoId:
 *                 type: integer
 *               grupoId:
 *                 type: integer
 *               usuariosIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Escola criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/', authMiddleware, isCoordenadorOrAdmin, escolaController.criarEscola);

/**
 * @swagger
 * /api/escolas/{id}:
 *   put:
 *     summary: Atualizar escola
 *     description: Atualiza uma escola existente
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da escola
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               regiaoId:
 *                 type: integer
 *               grupoId:
 *                 type: integer
 *               usuariosIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Escola atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Escola não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/:id', authMiddleware, isCoordenadorOrAdmin, escolaController.atualizarEscola);

/**
 * @swagger
 * /api/escolas/{id}:
 *   delete:
 *     summary: Excluir escola
 *     description: Exclui uma escola existente
 *     tags: [Escolas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da escola
 *     responses:
 *       200:
 *         description: Escola excluída com sucesso
 *       400:
 *         description: Não é possível excluir a escola
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso negado
 *       404:
 *         description: Escola não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/:id', authMiddleware, isAdmin, escolaController.excluirEscola);

module.exports = router; 