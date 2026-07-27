/* ============================================
   AGRODIGITAL — CHAT INTERNO
   Canal por fazenda + assistente IA (Gemini).
   Mensagens salvas no navegador (localStorage).
   Uso: <ChatInterno usuario="Altair" fazendas={['Fazenda 1', ...]} />
   ============================================ */

import { useEffect, useRef, useState } from 'react';
import { perguntarGemini, geminiConfigurado } from '../services/gemini';

type Msg = { autor: string; texto: string; hora: string; ia?: boolean };

const CHAVE = 'agrodigital_chat_v1';

function carregar(): Record<string, Msg[]> {
  try { return JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch { return {}; }
}
function salvar(dados: Record<string, Msg[]>) {
  localStorage.setItem(CHAVE, JSON.stringify(dados));
}
function agora() {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatInterno({
  usuario = 'Usuário',
  fazendas = ['Geral'],
}: { usuario?: string; fazendas?: string[] }) {
  const canais = ['Geral', ...fazendas.filter(f => f !== 'Geral')];
  const [canal, setCanal] = useState(canais[0]);
  const [todas, setTodas] = useState<Record<string, Msg[]>>(carregar);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const fimRef = useRef<HTMLDivElement>(null);

  const msgs = todas[canal] || [];

  useEffect(() => { fimRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs.length, canal]);

  function adicionar(m: Msg) {
    setTodas(prev => {
      const novo = { ...prev, [canal]: [...(prev[canal] || []), m] };
      salvar(novo);
      return novo;
    });
  }

  async function enviar() {
    const t = texto.trim();
    if (!t || pensando) return;
    setTexto('');
    adicionar({ autor: usuario, texto: t, hora: agora() });

    // Mensagem começando com /ia vai para o assistente
    if (t.toLowerCase().startsWith('/ia')) {
      setPensando(true);
      const resposta = await perguntarGemini(t.slice(3).trim(), `Canal: ${canal}`);
      adicionar({ autor: 'Assistente IA', texto: resposta, hora: agora(), ia: true });
      setPensando(false);
    }
  }

  return (
    <div className="ag-card" style={{ display: 'flex', flexDirection: 'column', height: 520, padding: 0, overflow: 'hidden' }}>
      {/* Cabeçalho + canais */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--ag-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <i className="ri-chat-3-line" style={{ color: 'var(--ag-accent)', fontSize: 20 }} />
          <strong>Chat interno</strong>
          <span className="ag-badge" style={{ marginLeft: 'auto' }}>
            {geminiConfigurado() ? 'IA ativa' : 'IA desligada'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
          {canais.map(c => (
            <button
              key={c}
              onClick={() => setCanal(c)}
              className={c === canal ? 'ag-btn' : 'ag-btn ag-btn-ghost'}
              style={{ padding: '6px 12px', fontSize: 13, whiteSpace: 'nowrap' }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Mensagens */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <p style={{ color: 'var(--ag-text-dim)', textAlign: 'center', margin: 'auto', fontSize: 14 }}>
            Nenhuma mensagem em {canal}.<br />
            Digite <strong>/ia sua pergunta</strong> para falar com o assistente.
          </p>
        )}
        {msgs.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.autor === usuario ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              background: m.ia ? 'var(--ag-accent-soft)' : m.autor === usuario ? 'var(--ag-accent)' : 'var(--ag-surface-2)',
              color: m.autor === usuario && !m.ia ? '#fff' : 'var(--ag-text)',
              borderRadius: 12,
              padding: '8px 12px',
              fontSize: 14,
            }}
          >
            <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 2 }}>
              {m.ia && <i className="ri-sparkling-2-line" />} {m.autor} · {m.hora}
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{m.texto}</div>
          </div>
        ))}
        {pensando && <div style={{ color: 'var(--ag-text-dim)', fontSize: 13 }}><i className="ri-loader-4-line" /> Assistente pensando…</div>}
        <div ref={fimRef} />
      </div>

      {/* Entrada */}
      <div style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--ag-border)' }}>
        <input
          className="ag-input"
          placeholder={`Mensagem em ${canal}… (/ia para o assistente)`}
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar()}
        />
        <button className="ag-btn" onClick={enviar} aria-label="Enviar">
          <i className="ri-send-plane-2-line" />
        </button>
      </div>
    </div>
  );
}
