import { useState } from 'react';

type Op = { id: number; fazenda: string; tipo: string; descricao: string; responsavel: string; maquina: string; status: string; data: string };

const FAZENDAS = ['Fazenda Saudade', 'Fazenda do Lago', 'Fazenda Pateirinho', 'Fazenda Santa Luzia', 'Fazenda Pipe'];
const TIPOS = ['Plantio', 'Colheita', 'Pulverização', 'Adubação', 'Manutenção', 'Transporte', 'Outro'];
const STATUS_LIST = ['Agendado', 'Em andamento', 'Concluído', 'Cancelado'];
const CHAVE = 'agrodigital_operacoes_v1';

const INICIAL: Op[] = [
  { id:1, fazenda:'Fazenda Saudade',     tipo:'Adubação',      descricao:'Aplicação de ureia safra milho',     responsavel:'João Silva',    maquina:'Trator John Deere 6110J', status:'Concluído',     data:'15/07/2025' },
  { id:2, fazenda:'Fazenda do Lago',     tipo:'Pulverização',  descricao:'Controle de pragas soja 2ª safra',   responsavel:'Carlos Mendes', maquina:'Pulverizador Jacto',      status:'Em andamento',  data:'27/07/2025' },
  { id:3, fazenda:'Fazenda Pateirinho',  tipo:'Manutenção',    descricao:'Revisão geral colheitadeira',        responsavel:'Pedro Alves',   maquina:'Colheitadeira Case 8250', status:'Agendado',      data:'30/07/2025' },
  { id:4, fazenda:'Fazenda Santa Luzia', tipo:'Plantio',       descricao:'Plantio milho safrinha área norte',  responsavel:'Marcos Lima',   maquina:'Plantadeira Massey 4x4',  status:'Agendado',      data:'01/08/2025' },
  { id:5, fazenda:'Fazenda Pipe',        tipo:'Adubação',      descricao:'Aplicação NPK pré-plantio',          responsavel:'António Lopes', maquina:'Trator Valtra A750',      status:'Em andamento',  data:'27/07/2025' },
  { id:6, fazenda:'Fazenda Saudade',     tipo:'Transporte',    descricao:'Transporte soja colhida para silo',  responsavel:'José Santos',   maquina:'Caminhão Mercedes 2040',  status:'Concluído',     data:'10/07/2025' },
];

const STATUS_COR: any = {
  'Agendado':      { bg:'#1e3a5f', cor:'#60a5fa' },
  'Em andamento':  { bg:'#14532d', cor:'#4ade80' },
  'Concluído':     { bg:'#422006', cor:'#fb923c' },
  'Cancelado':     { bg:'#450a0a', cor:'#f0f0f0' },
};

const TIPO_ICONE: any = {
  'Plantio':'', 'Colheita':'', 'Pulverização':'', 'Adubação':'',
  'Manutenção':'', 'Transporte':'', 'Outro':'',
};

const carregar = (): Op[] => { try { return JSON.parse(localStorage.getItem(CHAVE) || JSON.stringify(INICIAL)); } catch { return INICIAL; } };
const salvar = (l: Op[]) => localStorage.setItem(CHAVE, JSON.stringify(l));

export default function Operacoes() {
  const [ops, setOps] = useState<Op[]>(carregar);
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [filtroFaz, setFiltroFaz] = useState('Todas');
  const [aba, setAba] = useState<'lista'|'novo'>('lista');
  const [form, setForm] = useState({ fazenda: FAZENDAS[0], tipo: TIPOS[0], descricao: '', responsavel: '', maquina: '', status: 'Agendado', data: new Date().toLocaleDateString('pt-BR') });

  const filtradas = ops.filter(o =>
    (filtroStatus === 'Todos' || o.status === filtroStatus) &&
    (filtroFaz === 'Todas' || o.fazenda === filtroFaz)
  );

  const emAndamento = ops.filter(o => o.status === 'Em andamento').length;
  const agendadas = ops.filter(o => o.status === 'Agendado').length;
  const concluidas = ops.filter(o => o.status === 'Concluído').length;

  function adicionar() {
    if (!form.descricao || !form.responsavel) return;
    const nova: Op = { id: Date.now(), ...form };
    const lista = [nova, ...ops];
    setOps(lista); salvar(lista);
    setForm(f => ({ ...f, descricao: '', responsavel: '', maquina: '' }));
    setAba('lista');
  }

  function remover(id: number) {
    const lista = ops.filter(o => o.id !== id);
    setOps(lista); salvar(lista);
  }

  return (
    <div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
        <h2 style={{margin:0}}> Operações</h2>
        <button onClick={() => setAba(aba === 'novo' ? 'lista' : 'novo')} style={{padding:'8px 18px', background:'#F97316', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer'}}>
          {aba === 'novo' ? '← Voltar' : '+ Nova operação'}
        </button>
      </div>
      <p style={{color:'#94a3b8', fontSize:13, marginBottom:24}}>Maquinário, equipes e atividades de campo</p>

      {aba === 'novo' ? (
        <div style={{background:'#1e293b', borderRadius:12, padding:24, maxWidth:500}}>
          <h3 style={{margin:'0 0 20px'}}>Nova operação</h3>
          {[
            {label:'Fazenda', el:<select value={form.fazenda} onChange={e=>setForm(f=>({...f,fazenda:e.target.value}))} style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8}}>{FAZENDAS.map(f=><option key={f}>{f}</option>)}</select>},
            {label:'Tipo', el:<select value={form.tipo} onChange={e=>setForm(f=>({...f,tipo:e.target.value}))} style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8}}>{TIPOS.map(t=><option key={t}>{t}</option>)}</select>},
            {label:'Descrição', el:<input value={form.descricao} onChange={e=>setForm(f=>({...f,descricao:e.target.value}))} placeholder="Ex.: Plantio milho área norte" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
            {label:'Responsável', el:<input value={form.responsavel} onChange={e=>setForm(f=>({...f,responsavel:e.target.value}))} placeholder="Ex.: João Silva" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
            {label:'Máquina', el:<input value={form.maquina} onChange={e=>setForm(f=>({...f,maquina:e.target.value}))} placeholder="Ex.: Trator John Deere" style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8,boxSizing:'border-box' as any}}/>},
            {label:'Status', el:<select value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} style={{width:'100%',padding:'10px',background:'#0f172a',color:'#fff',border:'1px solid #334155',borderRadius:8}}>{STATUS_LIST.map(s=><option key={s}>{s}</option>)}</select>},
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
              {label:'Em andamento', val:emAndamento, cor:'#f0f0f0'},
              {label:'Agendadas',    val:agendadas,   cor:'#60a5fa'},
              {label:'Concluídas',   val:concluidas,  cor:'#fb923c'},
              {label:'Total',        val:ops.length,  cor:'#F97316'},
            ].map(c => (
              <div key={c.label} style={{background:'#1e293b',borderRadius:10,padding:'16px'}}>
                <div style={{color:'#94a3b8',fontSize:12,marginBottom:6}}>{c.label}</div>
                <div style={{color:c.cor,fontWeight:700,fontSize:22}}>{c.val}</div>
              </div>
            ))}
          </div>

          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
            {['Todos',...STATUS_LIST].map(s => (
              <button key={s} onClick={() => setFiltroStatus(s)} style={{padding:'5px 12px',borderRadius:20,border:'none',cursor:'pointer',fontSize:11,fontWeight:600,background:filtroStatus===s?'#F97316':'#1e293b',color:filtroStatus===s?'#fff':'#94a3b8'}}>{s}</button>
            ))}
          </div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
            {['Todas',...FAZENDAS].map(f => (
              <button key={f} onClick={() => setFiltroFaz(f)} style={{padding:'5px 12px',borderRadius:20,border:'1px solid #334155',cursor:'pointer',fontSize:11,background:filtroFaz===f?'#334155':'transparent',color:filtroFaz===f?'#fff':'#64748b'}}>{f}</button>
            ))}
          </div>

          <div style={{display:'grid', gap:10}}>
            {filtradas.map(o => {
              const sc = STATUS_COR[o.status];
              return (
                <div key={o.id} style={{background:'#1e293b',borderRadius:10,padding:'16px 20px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:12,alignItems:'center'}}>
                  <div>
                    <div style={{color:'#F97316',fontSize:12,fontWeight:600}}>{o.fazenda}</div>
                    <div style={{color:'#e2e8f0',fontWeight:600,fontSize:14,marginTop:2}}>{TIPO_ICONE[o.tipo]} {o.tipo} — {o.descricao}</div>
                    <div style={{color:'#64748b',fontSize:11,marginTop:2}}> {o.maquina}</div>
                  </div>
                  <div>
                    <div style={{color:'#64748b',fontSize:11}}>Responsável</div>
                    <div style={{color:'#e2e8f0',fontSize:13}}>{o.responsavel}</div>
                  </div>
                  <div>
                    <div style={{color:'#64748b',fontSize:11}}>Data</div>
                    <div style={{color:'#94a3b8',fontSize:12}}>{o.data}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{background:sc.bg,color:sc.cor,padding:'4px 10px',borderRadius:20,fontSize:11,fontWeight:700}}>{o.status}</span>
                    <button onClick={() => remover(o.id)} style={{background:'none',border:'none',color:'#f0f0f0',cursor:'pointer',fontSize:18,marginLeft:'auto'}}>×</button>
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
