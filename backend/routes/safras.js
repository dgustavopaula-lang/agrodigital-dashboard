// ============================================
// ROTAS DE SAFRAS
// ============================================

const express = require('express');
const router = express.Router();
const controller = require('../controllers/safras-controller');

router.get('/', controller.listar);                          // GET  /api/safras
router.get('/fazenda/:fazendaId', controller.listarPorFazenda); // GET  /api/safras/fazenda/1
router.post('/', controller.criar);                          // POST /api/safras

module.exports = router;
