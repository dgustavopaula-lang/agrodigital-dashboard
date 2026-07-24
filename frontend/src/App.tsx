import GeminiAssistente from './components/GeminiAssistente';
import AnaliseConcorrentes from './components/AnaliseConcorrentes';
import { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';

const API = 'https://agrodigital-api.onrender.com/api';

export default function App() {
  const [logado, setLogado] = useState(false);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [secao, setSecao] = useState('dashboard');
  const [fazendas, setFazendas] = useState<any[]>([]);
  const [fazendaSel, setFazendaSel] = useState<any>(null);
  const [carregando, setCarregando] = useState(false);

  const fmt = (v: number) => 'R$ ' + v.toLocaleString('pt-BR');

  useEffect(() => {
    if (!logado) return;
    setCarregando(true);
    fetch(`${API}/fazendas`)
      .then(r => r.json())
      .then(data => {
        setFazendas(data);
        if (data.length > 0) setFazendaSel(data[0]);
      })
      .catch(err => console.error('Erro API:', err))
      .finally(() => setCarregando(false));
  }, [logado]);

  if (!logado) return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-logo"><h1>AgroDigital</h1><p>Gestao inteligente do campo</p></div>
        <label>Email<input value={email} onChange={e => setEmail(e.target.value)} placeholder="fazenda@agrodigital.com" /></label>
        <label>Senha<input type="password" value={senha} onChange={e => setSenha(e.target.value)} /></label>
        <button onClick={() => { if (email && senha) setLogado(true); }} className="btn-entrar">Entrar</button>
        <p className="login-demo">Demo: fazenda@agrodigital.com / 123456</p>
      </div>
    </div>
  );

  const menu = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'fazendas', label: 'Fazendas' },
    { id: 'fazenda', label: 'Minha Fazenda' },
  { id: 'assistente', label: '🌱 Assistente IA' },
  { id: 'concorrentes', label: '📊 Concorrentes' },
  ];

  return (
    <div className="app-layout">
      <aside className="sidebar aberto">
        <div className="sidebar-header">
          <span className="sidebar-logo">AgroDigital</span>
        </div>
        <nav>
          {menu.map(m => (
            <button key={m.id} className={secao === m.id ? 'nav-item ativo' : 'nav-item'} onClick={() => setSecao(m.id)}>
              {m.label}
            </button>
          ))}
        </nav>
      </aside>
      <main>
        <div className="topbar">
          <h2>{menu.find(m => m.id === secao)?.label}</h2>
          <span>{fazendaSel ? `${fazendaSel.nome} - ${fazendaSel.cidade}, ${fazendaSel.estado}` : 'Carregando...'}</span>
          <button className="btn-usuario">Gustavo</button>
        </div>

        {carregando && <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>Carregando dados...</div>}

        {!carregando && secao === 'dashboard' && fazendaSel && (
          <div className="secao">
            <div className="dash-grid">
              <div className="dash-card-grande">
                <h3 className="dash-titulo">Resumo da Fazenda</h3>
                <div className="info-row"><span>Nome</span><strong>{fazendaSel.nome}</strong></div>
                <div className="info-row"><span>Proprietário</span><strong>{fazendaSel.proprietario}</strong></div>
                <div className="info-row"><span>Cidade</span><strong>{fazendaSel.cidade} - {fazendaSel.estado}</strong></div>
                <div className="info-row"><span>País</span><strong>{fazendaSel.pais}</strong></div>
                <div className="info-row"><span>Área</span><strong>{fazendaSel.areaHectares} ha</strong></div>
                <div className="info-row"><span>Cultura Principal</span><strong>{fazendaSel.culturaPrincipal}</strong></div>
                <div className="info-row"><span>Status</span><strong>{fazendaSel.ativa ? 'Ativa' : 'Inativa'}</strong></div>
              </div>
              <div className="dash-kpi-card kpi-verde">
                <p className="kpi-label">Total de Fazendas</p>
                <strong className="kpi-valor">{fazendas.length}</strong>
              </div>
              <div className="dash-kpi-card kpi-azul">
                <p className="kpi-label">Fazendas Ativas</p>
                <strong className="kpi-valor">{fazendas.filter(f => f.ativa).length}</strong>
              </div>
            </div>
          </div>
        )}

        {!carregando && secao === 'fazendas' && (
          <div className="secao">
            <div className="painel">
              <h3>Fazendas Cadastradas</h3>
              <table className="tabela">
                <thead><tr><th>Nome</th><th>Proprietário</th><th>Cidade</th><th>Estado</th><th>Área (ha)</th><th>Cultura</th><th>Status</th></tr></thead>
                <tbody>
                  {fazendas.map((f, i) => (
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
            </div>
          </div>
        )}

                {secao === 'concorrentes' && (
          <div className="secao"><AnaliseConcorrentes /></div>
        )}
        {secao === 'assistente' && (
          <div className="secao"><GeminiAssistente /></div>
        )}
        {!carregando && secao === 'fazenda' && fazendaSel && (
          <div className="secao">
            <div className="painel fazenda-info">
              <h3>Dados da Fazenda</h3>
              <div className="info-row"><span>Nome</span><strong>{fazendaSel.nome}</strong></div>
              <div className="info-row"><span>Proprietário</span><strong>{fazendaSel.proprietario}</strong></div>
              <div className="info-row"><span>Local</span><strong>{fazendaSel.cidade} - {fazendaSel.estado}, {fazendaSel.pais}</strong></div>
              <div className="info-row"><span>Área</span><strong>{fazendaSel.areaHectares} ha</strong></div>
              <div className="info-row"><span>Cultura Principal</span><strong>{fazendaSel.culturaPrincipal}</strong></div>
              <div className="info-row"><span>Status</span><strong>{fazendaSel.ativa ? 'Ativa' : 'Inativa'}</strong></div>
            </div>
          </div>
        )}

        <ChatBot />
      </main>
    </div>
  );
}
