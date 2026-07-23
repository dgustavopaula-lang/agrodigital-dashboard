// ============================================
// CONTROLLER DE FAZENDAS
// ============================================
// O controller contém a LÓGICA de cada operação.
// A rota recebe o pedido -> o controller resolve.
// Aqui você aprende o CRUD completo:
// Create (POST), Read (GET), Update (PUT), Delete (DELETE)
// ============================================

const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, '..', 'data', 'fazendas.json');

// --- Funções auxiliares de leitura/escrita no JSON ---

function lerFazendas() {
  const conteudo = fs.readFileSync(ARQUIVO, 'utf-8');
  return JSON.parse(conteudo);
}

function salvarFazendas(fazendas) {
  // null, 2 = formata o JSON com indentação de 2 espaços (legível)
  fs.writeFileSync(ARQUIVO, JSON.stringify(fazendas, null, 2));
}

// --- READ: listar todas as fazendas ---
// GET /api/fazendas
function listar(req, res) {
  const fazendas = lerFazendas();
  res.json(fazendas);
}

// --- READ: buscar uma fazenda pelo id ---
// GET /api/fazendas/3
function buscarPorId(req, res) {
  const id = Number(req.params.id); // req.params pega o :id da URL
  const fazendas = lerFazendas();
  const fazenda = fazendas.find(f => f.id === id);

  if (!fazenda) {
    return res.status(404).json({ erro: `Fazenda com id ${id} não encontrada` });
  }

  res.json(fazenda);
}

// --- CREATE: cadastrar nova fazenda ---
// POST /api/fazendas  (com JSON no corpo)
function criar(req, res) {
  const { nome, proprietario, cidade, estado, pais, areaHectares, culturaPrincipal } = req.body;

  // Validação simples: nome é obrigatório
  if (!nome) {
    return res.status(400).json({ erro: 'O campo "nome" é obrigatório' });
  }

  const fazendas = lerFazendas();

  // Gera o próximo id (maior id existente + 1)
  const novoId = fazendas.length > 0
    ? Math.max(...fazendas.map(f => f.id)) + 1
    : 1;

  const novaFazenda = {
    id: novoId,
    nome,
    proprietario: proprietario || 'Não informado',
    cidade: cidade || '',
    estado: estado || '',
    pais: pais || 'Brasil',
    areaHectares: areaHectares || 0,
    culturaPrincipal: culturaPrincipal || '',
    ativa: true
  };

  fazendas.push(novaFazenda);
  salvarFazendas(fazendas);

  // 201 = "Created" (criado com sucesso)
  res.status(201).json(novaFazenda);
}

// --- UPDATE: atualizar uma fazenda existente ---
// PUT /api/fazendas/2  (com JSON no corpo)
function atualizar(req, res) {
  const id = Number(req.params.id);
  const fazendas = lerFazendas();
  const indice = fazendas.findIndex(f => f.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: `Fazenda com id ${id} não encontrada` });
  }

  // Mescla os dados antigos com os novos (o novo sobrescreve)
  fazendas[indice] = { ...fazendas[indice], ...req.body, id };
  salvarFazendas(fazendas);

  res.json(fazendas[indice]);
}

// --- DELETE: remover uma fazenda ---
// DELETE /api/fazendas/2
function remover(req, res) {
  const id = Number(req.params.id);
  const fazendas = lerFazendas();
  const indice = fazendas.findIndex(f => f.id === id);

  if (indice === -1) {
    return res.status(404).json({ erro: `Fazenda com id ${id} não encontrada` });
  }

  const [removida] = fazendas.splice(indice, 1);
  salvarFazendas(fazendas);

  res.json({ mensagem: 'Fazenda removida com sucesso', fazenda: removida });
}

module.exports = { listar, buscarPorId, criar, atualizar, remover };
