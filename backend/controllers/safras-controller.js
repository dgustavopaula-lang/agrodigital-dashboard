// ============================================
// CONTROLLER DE SAFRAS
// ============================================
// Segundo recurso da API. Aqui você aprende
// RELACIONAMENTO entre dados: cada safra
// pertence a uma fazenda (fazendaId).
// ============================================

const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, '..', 'data', 'safras.json');
const ARQUIVO_FAZENDAS = path.join(__dirname, '..', 'data', 'fazendas.json');

function lerSafras() {
  return JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'));
}

function lerFazendas() {
  return JSON.parse(fs.readFileSync(ARQUIVO_FAZENDAS, 'utf-8'));
}

function salvarSafras(safras) {
  fs.writeFileSync(ARQUIVO, JSON.stringify(safras, null, 2));
}

// GET /api/safras
// Lista todas as safras JÁ COM o nome da fazenda (join manual)
function listar(req, res) {
  const safras = lerSafras();
  const fazendas = lerFazendas();

  const safrasCompletas = safras.map(safra => {
    const fazenda = fazendas.find(f => f.id === safra.fazendaId);
    return {
      ...safra,
      nomeFazenda: fazenda ? fazenda.nome : 'Fazenda não encontrada'
    };
  });

  res.json(safrasCompletas);
}

// GET /api/safras/fazenda/3
// Lista apenas as safras de UMA fazenda
function listarPorFazenda(req, res) {
  const fazendaId = Number(req.params.fazendaId);
  const safras = lerSafras().filter(s => s.fazendaId === fazendaId);
  res.json(safras);
}

// POST /api/safras
function criar(req, res) {
  const { fazendaId, cultura, anoSafra, areaPlantadaHectares, producaoEstimadaSacas } = req.body;

  if (!fazendaId || !cultura) {
    return res.status(400).json({ erro: 'Campos "fazendaId" e "cultura" são obrigatórios' });
  }

  // Valida se a fazenda existe antes de criar a safra
  const fazendaExiste = lerFazendas().some(f => f.id === Number(fazendaId));
  if (!fazendaExiste) {
    return res.status(400).json({ erro: `Fazenda com id ${fazendaId} não existe` });
  }

  const safras = lerSafras();
  const novoId = safras.length > 0 ? Math.max(...safras.map(s => s.id)) + 1 : 1;

  const novaSafra = {
    id: novoId,
    fazendaId: Number(fazendaId),
    cultura,
    anoSafra: anoSafra || String(new Date().getFullYear()),
    areaPlantadaHectares: areaPlantadaHectares || 0,
    producaoEstimadaSacas: producaoEstimadaSacas || 0,
    status: 'planejada'
  };

  safras.push(novaSafra);
  salvarSafras(safras);

  res.status(201).json(novaSafra);
}

module.exports = { listar, listarPorFazenda, criar };
