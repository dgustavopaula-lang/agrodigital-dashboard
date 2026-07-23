const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro MongoDB:', err));

// Rotas modulares
const fazendasRoutes = require('./routes/fazendas');
const safrasRoutes = require('./routes/safras');
const concorrentesRoutes = require('./routes/concorrentes');

app.use('/api/fazendas', fazendasRoutes);
app.use('/api/safras', safrasRoutes);
app.use('/api/concorrentes', concorrentesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth simples
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (email === 'fazenda@agrodigital.com' && senha === '123456') {
      res.json({ usuario: { nome: 'Gustavo', email, fazendaPrincipal: null } });
    } else {
      res.status(401).json({ erro: 'Credenciais inválidas' });
    }
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
