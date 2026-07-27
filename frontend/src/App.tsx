import GeminiAssistente from './components/GeminiAssistente';
import AnaliseConcorrentes from './components/AnaliseConcorrentes';
import FluxoComercial from './pages/FluxoComercial';
import FinanceiroAltair from './pages/FinanceiroAltair';
import ChatInterno from './components/ChatInterno';
import { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';
import MapaFazendas from './components/MapaFazendas';

const API = 'https://agrodigital-api.onrender.com/api';

const FAZENDAS_ALTAIR = [
  'Fazenda do Lago',
  'Fazenda Saudade',
  'Fazenda Pateirinho',
  'Fazenda Santa Luzia',
  'Fazenda Pipe',
];

export default function App() {
  const [logado, setLogado] = useState(false);
  const [secao, setSecao] = useState('dashboard');
  const [fazendas, setFazendas] = useState([]);
  const [fazendaSel, setFazendaSel] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${API}/fazendas`)
      .then(r => r.json())
      .then(d => { setFazendas(d); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  const menu = [
    { id: 'dashboard',  label: '📊 Dashboard' },
    { id: 'fazendas',   label: '🏡 Fazendas' },
    { id: 'mapa',       label: '🗺️ Mapa' },
    { id: 'safra',      label: '🌱 Safra' },
    { id: 'operacoes',  label: '🚜 Operações' },
    { id: 'estoque',    label: '📦 Estoque' },
    { id: 'clima',      label: '🌦️ Clima' },
    { id: 'financeiro', label: '💰 Financeiro' },
    { id: 'fluxo',      label: '📈 Fluxo Comercial' },
  ];

  return (
    <div className="app">
      <nav className="topbar">
        <span className="logo">🌾 AgroDigital</span>
        <div className="nav-links">
          {menu.map(m => (
            <button
              key={m.id}
              className={secao === m.id ? 'nav-btn ativo' : 'nav-btn'}
              onClick={() => setSecao(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="conteudo">

        {secao === 'dashboard' && (
          <div className="secao">
            <h2>Dashboard Geral</h2>
            <div className="cards-grid">
              <div className="card-stat"><span>Total de Fazendas</span><strong>{fazendas.length}</strong></div>
              <div className="card-stat"><span>Área Total</span><strong>11.000 ha</strong></div>
              <div className="card-stat"><span>Fazendas Ativas</span><strong>{fazendas.filter((f:any) => f.ativa).length}</strong></div>
              <div className="card-stat"><span>Cultura Principal</span><strong>Soja / Milho</strong></div>
            </div>
          </div>
        )}

        {secao === 'fazendas' && (
          <div className="secao">
            <h2>Fazendas</h2>
            {carregando ? <p>Carregando...</p> : (
              <table className="tabela">
                <thead>
                  <tr><th>Nome</th><th>Proprietário</th><th>Cidade</th><th>Estado</th><th>Área (ha)</th><th>Cultura</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {fazendas.map((f:any, i:number) => (
                    <tr key={i} onClick={() => { setFazendaSel(f); setSecao('fazenda'); }} style={{ cursor: 'pointer' }}>
                      <td>{f.nome}</td>
                      <td>{f.proprietario}</td>
                      <td>{f.cidade}</td>
                      <td>{f.estado}</td>
                      <td>{f.areaHectares}</td>
                      <td>{f.culturaPrincipal}</td>
                      <td><span className={f.ativa ? 'badge badge-positivo' : 'badge badge-negativo'}>{f.ativa ? 'Ativa' : 'Inativa'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {secao === 'mapa' && <div className="secao"><MapaFazendas /></div>}

        {secao === 'safra' && (
          <div className="secao">
            <h2>🌱 Safra</h2>
            <p style={{color:'#94a3b8'}}>Módulo em desenvolvimento — planejamento e acompanhamento de plantio e colheita.</p>
          </div>
        )}

        {secao === 'operacoes' && (
          <div className="secao">
            <h2>🚜 Operações</h2>
            <p style={{color:'#94a3b8'}}>Módulo em desenvolvimento — maquinário, equipes e atividades de campo.</p>
          </div>
        )}

        {secao === 'estoque' && (
          <div className="secao">
            <h2>📦 Estoque</h2>
            <p style={{color:'#94a3b8'}}>Módulo em desenvolvimento — insumos, sementes e defensivos.</p>
          </div>
        )}

        {secao === 'clima' && (
          <div className="secao">
            <h2>🌦️ Clima</h2>
            <p style={{color:'#94a3b8'}}>Módulo em desenvolvimento — previsão do tempo por fazenda.</p>
          </div>
        )}

        {secao === 'financeiro' && <div className="secao"><FinanceiroAltair /></div>}

        {secao === 'fluxo' && <div className="secao"><FluxoComercial /></div>}

        {!carregando && secao === 'fazenda' && fazendaSel && (
          <div className="secao">
            <div className="painel fazenda-info">
              <h3>Dados da Fazenda</h3>
              <div className="info-row"><span>Nome</span><strong>{(fazendaSel as any).nome}</strong></div>
              <div className="info-row"><span>Proprietário</span><strong>{(fazendaSel as any).proprietario}</strong></div>
              <div className="info-row"><span>Local</span><strong>{(fazendaSel as any).cidade} - {(fazendaSel as any).estado}, {(fazendaSel as any).pais}</strong></div>
              <div className="info-row"><span>Área</span><strong>{(fazendaSel as any).areaHectares} ha</strong></div>
              <div className="info-row"><span>Cultura Principal</span><strong>{(fazendaSel as any).culturaPrincipal}</strong></div>
              <div className="info-row"><span>Status</span><strong>{(fazendaSel as any).ativa ? 'Ativa' : 'Inativa'}</strong></div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
