import GeminiAssistente from './components/GeminiAssistente';
import AnaliseConcorrentes from './components/AnaliseConcorrentes';
import FluxoComercial from './pages/FluxoComercial';
import FinanceiroAltair from './pages/FinanceiroAltair';
import ChatInterno from './components/ChatInterno';
import { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';
import MapaFazendas from './components/MapaFazendas';
import Clima from './components/Clima';
import Safra from './components/Safra';
import Estoque from './components/Estoque';
import Operacoes from './components/Operacoes';

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
      <nav style={{background:'#0f172a', padding:'12px 16px', borderBottom:'1px solid #1e293b'}}>
        <div style={{display:'flex', alignItems:'center', marginBottom:8}}>
          <span style={{color:'#F97316', fontWeight:700, fontSize:18}}>🌾 AgroDigital</span>
        </div>
        <div style={{display:'flex', flexWrap:'wrap', gap:6}}>
          {menu.map(m => (
            <button
              key={m.id}
              onClick={() => setSecao(m.id)}
              style={{
                padding:'6px 12px',
                borderRadius:20,
                border:'none',
                cursor:'pointer',
                fontSize:12,
                fontWeight:600,
                background: secao === m.id ? '#F97316' : '#1e293b',
                color: secao === m.id ? '#fff' : '#94a3b8',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="conteudo">

        {secao === 'dashboard' && (
          <div className="secao">
            <h2 style={{marginBottom: 24}}>Dashboard Geral</h2>
            <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32}}>
              {[
                {label:'Total de Fazendas', valor: fazendas.length, cor:'#F97316'},
                {label:'Área Total', valor:'11.000 ha', cor:'#22c55e'},
                {label:'Fazendas Ativas', valor: fazendas.filter((f:any)=>f.ativa).length, cor:'#3b82f6'},
                {label:'Cultura Principal', valor:'Soja / Milho', cor:'#a855f7'},
              ].map(c => (
                <div key={c.label} style={{background:'#1e293b', borderRadius:12, padding:'24px 20px'}}>
                  <div style={{color:'#94a3b8', fontSize:13, marginBottom:12}}>{c.label}</div>
                  <div style={{fontSize:28, fontWeight:700, color:c.cor}}>{c.valor}</div>
                </div>
              ))}
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
            <Safra />
          </div>
        )}

        {secao === 'operacoes' && (
          <div className="secao">
            <Operacoes />
          </div>
        )}

        {secao === 'estoque' && (
          <div className="secao">
            <Estoque />
          </div>
        )}

        {secao === 'clima' && (
          <div className="secao">
            <Clima />
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
