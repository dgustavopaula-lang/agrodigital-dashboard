// ============================================
// ROTAS DE FAZENDAS
// ============================================
// A rota define O ENDEREÇO e O MÉTODO HTTP.
// A lógica fica no controller (separação de
// responsabilidades - padrão profissional).
// ============================================

const express = require('express');
const router = express.Router();
const controller = require('../controllers/fazendas-controller');

router.get('/', controller.listar);           // GET    /api/fazendas
router.get('/:id', controller.buscarPorId);   // GET    /api/fazendas/1
router.post('/', controller.criar);           // POST   /api/fazendas
router.put('/:id', controller.atualizar);     // PUT    /api/fazendas/1
router.delete('/:id', controller.remover);    // DELETE /api/fazendas/1

module.exports = router;
