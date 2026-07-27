import { useMemo, useState } from 'react';

const FAZENDAS = [
  'Fazenda Saudade',
  'Fazenda do Lago',
  'Fazenda Pateirinho',
  'Fazenda Santa Luzia',
  'Fazenda Pipe',
];

type Lanc = { id: number; fazenda: string; tipo: 'receita' | 'despesa'; descricao: string; valor: number; data: string };

const CHAVE = 'agrodigital_fin_altair_v1';
const carregar = (): Lanc[] => { try { return JSON.parse(localStorage.getItem(CHAVE) || '[]'); } catch { return []; } };
const salvar = (l: Lanc[]) => localStorage.setItem(CHAVE, JSON.stringify(l));
const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function FinanceiroAltair() {
  const [lancs, setLancs] = useState<Lanc[]>(carregar);
  const [form, setForm] = useState({ fazenda: FAZENDAS[0], tipo: 'receita' as 'receita' | 'despesa', descricao: '', valor: '' });

  const resumoPorFazenda = useMemo(() => {
    return FAZENDAS.map(f => {
      const fl = lancs.filter(l => l.fazenda === f);
      const rec = fl.filter(l => l.tipo === 'receita').reduce((a, l) => a + l.valor, 0);
      const des = fl.filter(l => l.tipo === 'despesa').reduce((a, l) => a + l.valor, 0);
      return { fazenda: f, rec, des, saldo: rec - des };
    });
  }, [lancs]);

  const total = resumoPorFazenda.reduce((a, r) => ({ rec: a.rec + r.rec, des: a.des + r.des, saldo: a.saldo + r.saldo }), { rec: 0, des: 0, saldo: 0 });

  function registrar() {
    if (!form.descricao || !form.valor) return;
    const novo: Lanc = { id: Date.now(), fazenda: form.fazenda, tipo: form.tipo, descricao: form.descricao, valor: parseFloat(form.valor.replace(',', '.')), data: new Date().toLocaleDateString('pt-BR') };
    const lista = [novo, ...lancs];
    setLancs(lista);
    salvar(lista);
    setForm(f => ({ ...f, descricao: '', valor: '' }));
  }

  function remover(id: number) {
    const lista = lancs.filter(l => l.id !== id);
    setLancs(lista);
    salvar(lista);
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ margin: '10px 0 2px', fontSize: 26 }}>Financeiro · Altair</h1>
      <p style={{ color: '#94a3b8', margin: '0 0 24px' }}>5 fazendas · lançamentos em tempo real</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        {[{ label: 'Receitas totais', val: total.rec, cor: '#22c55e' }, { label: 'Despesas totais', val: total.des, cor: '#ef4444' }, { label: 'Saldo consolidado', val: total.saldo, cor: total.saldo >= 0 ? '#22c55e' : '#ef4444' }].map(c => (
          <div key={c.label} style={{ background: '#1e293b', borderRadius: 12, padding: 20 }}>
            <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.cor }}>{brl(c.val)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12, marginBottom: 32 }}>
        {resumoPorFazenda.map(r => (
          <div key={r.fazenda} style={{ background: '#1e293b', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, color: '#F97316', fontWeight: 600, marginBottom: 8 }}>{r.fazenda}</div>
            <div style={{ fontSize: 12, color: '#22c55e' }}>+{brl(r.rec)}</div>
            <div style={{ fontSize: 12, color: '#ef4444' }}>-{brl(r.des)}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: r.saldo >= 0 ? '#22c55e' : '#ef4444', marginTop: 4 }}>{brl(r.saldo)}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px' }}>Novo lançamento</h3>
          <select value={form.fazenda} onChange={e => setForm(f => ({ ...f, fazenda: e.target.value }))} style={{ width: '100%', marginBottom: 12, padding: '10px 12px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 8 }}>
            {FAZENDAS.map(f => <option key={f}>{f}</option>)}
          </select>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {(['receita', 'despesa'] as const).map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, tipo: t }))} style={{ flex: 1, padding: '10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: form.tipo === t ? (t === 'receita' ? '#22c55e' : '#ef4444') : '#334155', color: '#fff', fontWeight: 600 }}>
                {t === 'receita' ? 'Receita' : 'Despesa'}
              </button>
            ))}
          </div>
          <input placeholder="Descrição (ex.: venda de soja)" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} style={{ width: '100%', marginBottom: 12, padding: '10px 12px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 8, boxSizing: 'border-box' }} />
          <input placeholder="Valor (ex.: 12500,00)" value={form.valor} onChange={e => setForm(f => ({ ...f, valor: e.target.value }))} style={{ width: '100%', marginBottom: 12, padding: '10px 12px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: 8, boxSizing: 'border-box' }} />
          <button onClick={registrar} style={{ width: '100%', padding: '12px', background: '#F97316', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 15 }}>Registrar</button>
        </div>

        <div style={{ background: '#1e293b', borderRadius: 12, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px' }}>Últimos lançamentos</h3>
          {lancs.length === 0 ? <p style={{ color: '#94a3b8' }}>Nenhum lançamento ainda.</p> : (
            <div style={{ maxHeight: 320, overflowY: 'auto' }}>
              {lancs.slice(0, 20).map(l => (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #334155' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{l.descricao}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{l.fazenda} · {l.data}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, color: l.tipo === 'receita' ? '#22c55e' : '#ef4444' }}>{l.tipo === 'receita' ? '+' : '-'}{brl(l.valor)}</span>
                    <button onClick={() => remover(l.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 16 }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
