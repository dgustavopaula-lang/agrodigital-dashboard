const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/concorrentes.json');

// GET /api/concorrentes
router.get('/', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(data);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao ler dados de concorrentes.' });
  }
});

// GET /api/concorrentes/:id
router.get('/:id', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const item = data.concorrentes.find(c => c.id === parseInt(req.params.id));
    if (!item) return res.status(404).json({ erro: 'Concorrente não encontrado.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao ler dados.' });
  }
});

module.exports = router;
