import { useState, useRef, useEffect } from 'react';
import { X, MessageCircle, Send } from 'lucide-react';

export default function ChatBot() {
  const [aberto, setAberto] = useState(false);
  const [mensagens, setMensagens] = useState([
    { role: 'bot', text: 'Olá! Sou o assistente AgroDigital. Como posso ajudar?' }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [mensagens]);

  function enviar() {
    if (!input.trim()) return;
    setMensagens(m => [...m, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMensagens(m => [...m, { role: 'bot', text: 'Recebido! Em breve integração com IA.' }]);
    }, 800);
  }

  return (
    <>
      {!aberto && (
        <button
          onClick={() => setAberto(true)}
          style={{
            position: 'fixed', bottom: 24, right: 24,
            background: '#F97316', border: 'none', borderRadius: '50%',
            width: 52, height: 52, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)', zIndex: 1000
          }}
        >
          <MessageCircle size={24} color="#fff" />
        </button>
      )}
      {aberto && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          width: 320, height: 420, zIndex: 1000,
          background: '#0f172a', border: '1px solid #2a3a2e',
          borderRadius: 12, display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)', overflow: 'hidden'
        }}>
          <div style={{
            padding: '12px 16px', background: '#16241a',
            borderBottom: '1px solid #2a3a2e',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span style={{ color: '#e8f0ea', fontWeight: 600, fontSize: 14 }}>
              Assistente AgroDigital
            </span>
            <button onClick={() => setAberto(false)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9fb3a6' }}>
              <X size={18} />
            </button>
          </div>
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: 12,
            display: 'flex', flexDirection: 'column', gap: 8
          }}>
            {mensagens.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                background: m.role === 'user' ? '#F97316' : '#1e2d22',
                color: '#e8f0ea', borderRadius: 8, padding: '8px 12px',
                maxWidth: '80%', fontSize: 13
              }}>
                {m.text}
              </div>
            ))}
          </div>
          <div style={{
            padding: '8px 12px', borderTop: '1px solid #2a3a2e',
            display: 'flex', gap: 8
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviar()}
              placeholder="Digite sua mensagem..."
              style={{
                flex: 1, background: '#1e2d22', border: '1px solid #2a3a2e',
                borderRadius: 6, padding: '6px 10px', color: '#e8f0ea',
                fontSize: 13, outline: 'none'
              }}
            />
            <button onClick={enviar} style={{
              background: '#F97316', border: 'none', borderRadius: 6,
              padding: '6px 10px', cursor: 'pointer'
            }}>
              <Send size={16} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
