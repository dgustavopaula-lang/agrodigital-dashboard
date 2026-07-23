const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro MongoDB:', err));

// ─── SCHEMAS ────────────────────────────────────────────
const fazendaSchema = new mongoose.Schema({
  nome: String,
  proprietario: String,
  cidade: String,
  estado: String,
  pais: { type: String, default: 'Brasil' },
  areaHectares: Number,
  culturaPrincipal: String,
  ativa: { type: Boolean, default: true }
}, { timestamps: true });

const safraSchema = new mongoose.Schema({
  fazendaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fazenda' },
  cultura: String,
  ano: Number,
  areaPlantada: Number,
  producaoEstimada: Number,
  producaoReal: Number,
  status: { type: String, enum: ['planejada','em_andamento','colhida'], default: 'planejada' }
}, { timestamps: true });

const concorrenteSchema = new mongoose.Schema({
  nome: String,
  site: String,
  segmento: String,
  pontosForts: [String],
  pontosFracos: [String],
  precoMedio: String,
  publicoAlvo: String,
  notas: String
}, { timestamps: true });

const usuarioSchema = new mongoose.Schema({
  nome: String,
  email: { type: String, unique: true },
  senha: String,
  fazendaPrincipalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Fazenda' }
}, { timestamps: true });

const Fazenda = mongoose.model('Fazenda', fazendaSchema);
const Safra = mongoose.model('Safra', safraSchema);
const Concorrente = mongoose.model('Concorrente', concorrenteSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);

// ─── HEALTH ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── AUTH ────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = await Usuario.findOne({ email, senha }).populate('fazendaPrincipalId');
    if (!usuario) return res.status(401).json({ erro: 'Credenciais inválidas' });
    res.json({ usuario: { id: usuario._id, nome: usuario.nome, email: usuario.email, fazendaPrincipal: usuario.fazendaPrincipalId } });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ─── FAZENDAS ────────────────────────────────────────────
app.get('/api/fazendas', async (req, res) => {
  try {
    const fazendas = await Fazenda.find({ ativa: true });
    res.json(fazendas);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/api/fazendas/:id', async (req, res) => {
  try {
    const fazenda = await Fazenda.findById(req.params.id);
    if (!fazenda) return res.status(404).json({ erro: 'Fazenda não encontrada' });
    res.json(fazenda);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/fazendas', async (req, res) => {
  try {
    const fazenda = new Fazenda(req.body);
    await fazenda.save();
    res.status(201).json(fazenda);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.put('/api/fazendas/:id', async (req, res) => {
  try {
    const fazenda = await Fazenda.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(fazenda);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

app.delete('/api/fazendas/:id', async (req, res) => {
  try {
    await Fazenda.findByIdAndUpdate(req.params.id, { ativa: false });
    res.json({ mensagem: 'Fazenda desativada' });
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

// ─── SAFRAS ──────────────────────────────────────────────
app.get('/api/safras', async (req, res) => {
  try {
    const safras = await Safra.find().populate('fazendaId', 'nome cidade');
    res.json(safras);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/api/safras/fazenda/:id', async (req, res) => {
  try {
    const safras = await Safra.find({ fazendaId: req.params.id });
    res.json(safras);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/safras', async (req, res) => {
  try {
    const safra = new Safra(req.body);
    await safra.save();
    res.status(201).json(safra);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// ─── CONCORRENTES ────────────────────────────────────────
app.get('/api/concorrentes', async (req, res) => {
  try {
    const concorrentes = await Concorrente.find();
    res.json(concorrentes);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.get('/api/concorrentes/:id', async (req, res) => {
  try {
    const concorrente = await Concorrente.findById(req.params.id);
    if (!concorrente) return res.status(404).json({ erro: 'Não encontrado' });
    res.json(concorrente);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.post('/api/concorrentes', async (req, res) => {
  try {
    const concorrente = new Concorrente(req.body);
    await concorrente.save();
    res.status(201).json(concorrente);
  } catch (err) {
    res.status(400).json({ erro: err.message });
  }
});

// ─── 404 ─────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
