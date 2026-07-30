import { useState } from 'react';

type Item = { id: number; fazenda: string; produto: string; categoria: string; quantidade: number; unidade: string; minimo: number; data: string };

const FAZENDAS = ['Fazenda Saudade', 'Fazenda do Lago', 'Fazenda Pateirinho', 'Fazenda Santa Luzia', 'Fazenda Pipe'];
const CATEGORIAS = ['Semente', 'Fertilizante', 'Defensivo', 'Combustível', 'Outro'];
const CHAVE = 'agrodigital_estoque_v1';

const INICIAL: Item[] = [
  { id: 1, fazenda: 'Fazenda Saudade',     produto: 'Semente de Soja',      categoria: 'Semente',     quantidade: 4400,  unidade: 'kg',  minimo: 1000, data: '10/07/2025' },
  { id: 2, fazenda: 'Fazenda Saudade',     produto: 'Ureia',                categoria: 'Fertilizante',quantidade: 12000, unidade: 'kg',  minimo: 2000, data: '10/07/2025' },
  { id: 3, fazenda: 'Fazenda do Lago',     produto: 'Semente de Milho',     categoria: 'Semente',     quantidade: 180,   unidade: 'sc',  minimo: 50,   data: '12/07/2025' },
  { id: 4, fazenda: 'Fazenda do Lago',     produto: 'Glifosato',            categoria: 'Defensivo',   quantidade: 800,   unidade: 'L',   minimo: 200,  data: '12/07/2025' },
  { id: 5, fazenda: 'Fazenda Pateirinho',  produto: 'MAP',                  categoria: 'Fertilizante',quantidade: 8000,  unidade: 'kg',  minimo: 1500, data: '08/07/2025' },
  { id: 6, fazenda: 'Fazenda Santa Luzia', produto: 'Semente de Soja',      categoria: 'Semente',     quantidade: 5000,  unidade: 'kg',  minimo: 1000, data: '05/07/2025' },
  { id: 7, fazenda: 'Fazenda Santa Luzia', produto: 'Diesel',               categoria: 'Combustível', quantidade: 15000, unidade: 'L',   minimo: 3000, data: '15/07/2025' },
  { id: 8, fazenda: 'Fazenda Pipe',        produto: 'Fertilizante NPK',     categoria: 'Fertilizante',quantidade: 300,   unidade: 'kg',  minimo: 500,  data: '01/07/2025' },
];

const carregar = (): Item[] => { try { return JSON.parse(localStorage.getItem(CHAVE) || JSON.stringify(INICIAL)); } catch { return INICIAL; } };
const salvar = (l: Item[]) => localStorage.setItem(CHAVE, JSON.stringify(l));

export default function Estoque() {
  const [itens, setItens] = useState<Item[]>(carregar);
  const [filtroFaz, setFiltroFaz] = useState('Todas');
  const [filtroCat, setFiltroCat] = useState('Todas');
  const [form, setForm] = useState({ fazenda: FAZENDAS[0], produto: '', categoria: CATEGORIAS[0], quantidade: '', unidade: 'kg', minimo: '' });
  const [aba, setAba] = useState<'lista'|'novo'>('lista');

  const filtrados = itens.filter(i =>
    (filtroFaz === 'Todas' || i.fazenda === filtroFaz) &&
    (filtroCat === 'Todas' || i.categoria === filtroCat)
  );

  const criticos = itens.filter(i => i.quantidade <= i.minimo).length;

  function adicionar() {
    if (!form.produto || !form.quantidade) return;
    const novo: Item = { id: Date.now(), fazenda: form.fazenda, produto: form.produto, categoria: form.categoria, quantidade: parseFloat(form.quantidade), unidade: form.unidade, minimo: parseFloat(form.minimo || '0'), data: new Date().toLocaleDateString('pt-BR') };
    const lista = [novo, ...itens];
    setItens(lista); salvar(lista);
    setForm(f => ({ ...f, produto: '', quantidade: '', minimo: '' }));
    setAba('lista');
  }

  function remover(id: number) {
    const lista = itens.filter(i => i.id !== id);
    setItens(lista); salvar(lista);
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
        <h2 style={{margin:0}}> Estoque</h2>
        <button onClick={() => setAba(aba === 'novo' ? 'lista' : 'novo')} style={{padding:'8px 18px', background:'#F97316', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer'}}>
          {aba === 'novo' ? '← Voltar' : '+ Novo item'}
        </button>
      </div>
      <p style={{color:'#94a3b8', fontSize:13, marginBottom:24}}>Insumos, sementes e combustíveis por fazenda</p>

      {aba === 'novo' ? (
        <div style={{background:'#1e293b', borderRadius:12, padding:24, maxWidth:500}}>
          <h3 style={{margin:'0 0 20px'}}>Novo item</h3>
          {[
            {label:'Fazenda', el: <select value={form.fazenda} onChange={e => setForm(f=>({...f,fazenda:e.target.value}))} style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8}}>{FAZENDAS.map(f=><option key={f}>{f}</option>)}</select>},
            {label:'Produto', el: <input value={form.produto} onChange={e => setForm(f=>({...f,produto:e.target.value}))} placeholder="Ex.: Semente de Soja" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
            {label:'Categoria', el: <select value={form.categoria} onChange={e => setForm(f=>({...f,categoria:e.target.value}))} style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8}}>{CATEGORIAS.map(c=><option key={c}>{c}</option>)}</select>},
            {label:'Quantidade', el: <input value={form.quantidade} onChange={e => setForm(f=>({...f,quantidade:e.target.value}))} placeholder="Ex.: 5000" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
            {label:'Unidade', el: <input value={form.unidade} onChange={e => setForm(f=>({...f,unidade:e.target.value}))} placeholder="kg, L, sc" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
            {label:'Estoque mínimo', el: <input value={form.minimo} onChange={e => setForm(f=>({...f,minimo:e.target.value}))} placeholder="Ex.: 1000" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
          ].map(({label,el}) => (
            <div key={label} style={{marginBottom:12}}>
              <div style={{color:'#94a3b8',fontSize:12,marginBottom:4}}>{label}</div>
              {el}
            </div>
          ))}
          <button onClick={adicionar} style={{width:'100%',padding:'12px',background:'#F97316',color:'#fff',border:'none',borderRadius:8,fontWeight:700,cursor:'pointer',fontSize:15,marginTop:8}}>Salvar</button>
        </div>
      ) : (
        <>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px,1fr))', gap:12, marginBottom:24}}>
            {[
              {label:'Total de itens', val:itens.length, cor:'#F97316'},
              {label:'Itens críticos', val:criticos, cor: criticos > 0 ? '#f0f0f0' : '#f0f0f0'},
              {label:'Fazendas', val:5, cor:'#f0f0f0'},
              {label:'Categorias', val:CATEGORIAS.length, cor:'#f0f0f0'},
            ].map(c => (
              <div key={c.label} style={{background:'#1e293b',borderRadius:10,padding:'16px'}}>
                <div style={{color:'#94a3b8',fontSize:12,marginBottom:6}}>{c.label}</div>
                <div style={{color:c.cor,fontWeight:700,fontSize:22}}>{c.val}</div>
              </div>
            ))}
          </div>

          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
            {['Todas',...FAZENDAS].map(f => (
              <button key={f} onClick={() => setFiltroFaz(f)} style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:filtroFaz===f?'#F97316':'#1e293b',color:filtroFaz===f?'#fff':'#94a3b8'}}>{f}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
            {['Todas',...CATEGORIAS].map(c => (
              <button key={c} onClick={() => setFiltroCat(c)} style={{padding:'5px 12px',borderRadius:20,border:'1px solid #334155',cursor:'pointer',fontSize:11,background:filtroCat===c?'#334155':'transparent',color:filtroCat===c?'#fff':'#64748b'}}>{c}</button>
            ))}
          </div>

          <div style={{display:'grid', gap:10}}>
            {filtrados.map(i => {
              const critico = i.quantidade <= i.minimo;
              return (
                <div key={i.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr',gap:12,alignItems:'center',borderLeft:`3px solid ${critico?'#f0f0f0':'#334155'}`}}>
                  <div>
                    <div style={{color:'#F97316',fontSize:12,fontWeight:600}}>{i.fazenda}</div>
                    <div style={{color:'#e2e8f0',fontWeight:600,fontSize:14,marginTop:2}}>{i.produto}</div>
                    <div style={{color:'#64748b',fontSize:11}}>{i.categoria}</div>
                  </div>
                  <div>
                    <div style={{color:'#64748b',fontSize:11}}>Quantidade</div>
                    <div style={{color:critico?'#f0f0f0':'#e2e8f0',fontWeight:700,fontSize:15}}>{i.quantidade.toLocaleString()} {i.unidade}</div>
                  </div>
                  <div>
                    <div style={{color:'#64748b',fontSize:11}}>Mínimo</div>
                    <div style={{color:'#94a3b8',fontWeight:600}}>{i.minimo.toLocaleString()} {i.unidade}</div>
                  </div>
                  <div>
                    <div style={{color:'#64748b',fontSize:11}}>Atualizado</div>
                    <div style={{color:'#94a3b8',fontSize:12}}>{i.data}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    {critico && <span style={{background:'#450a0a',color:'#f0f0f0',padding:'3px 8px',borderRadius:12,fontSize:10,fontWeight:700}}>CRÍTICO</span>}
                    <button onClick={() => remover(i.id)} style={{background:'none',border:'none',color:'#f0f0f0',cursor:'pointer',fontSize:18,marginLeft:'auto'}}>×</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
