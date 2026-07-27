import { useState } from 'react';

const SAFRAS = [
  { fazenda: 'Fazenda Saudade',     cultura: 'Soja',  area: 2200, plantio: '15/10/2024', colheita: '20/02/2025', status: 'Colhido',        prod: 58, real: 2200*58 },
  { fazenda: 'Fazenda Saudade',     cultura: 'Milho', area: 800,  plantio: '15/01/2025', colheita: '15/06/2025', status: 'Em crescimento', prod: 120, real: 0 },
  { fazenda: 'Fazenda do Lago',     cultura: 'Soja',  area: 1800, plantio: '20/10/2024', colheita: '25/02/2025', status: 'Colhido',        prod: 55, real: 1800*55 },
  { fazenda: 'Fazenda do Lago',     cultura: 'Milho', area: 600,  plantio: '20/01/2025', colheita: '20/06/2025', status: 'Em crescimento', prod: 115, real: 0 },
  { fazenda: 'Fazenda Pateirinho',  cultura: 'Soja',  area: 1500, plantio: '10/10/2024', colheita: '15/02/2025', status: 'Colhido',        prod: 60, real: 1500*60 },
  { fazenda: 'Fazenda Santa Luzia', cultura: 'Soja',  area: 2500, plantio: '05/10/2024', colheita: '10/02/2025', status: 'Colhido',        prod: 62, real: 2500*62 },
  { fazenda: 'Fazenda Santa Luzia', cultura: 'Milho', area: 900,  plantio: '10/01/2025', colheita: '10/06/2025', status: 'Plantado',       prod: 118, real: 0 },
  { fazenda: 'Fazenda Pipe',        cultura: 'Soja',  area: 800,  plantio: '01/11/2024', colheita: '01/03/2025', status: 'Colhido',        prod: 45, real: 800*45 },
];

const STATUS_COR: any = {
  'Planejado':       { bg: '#1e293b', cor: '#94a3b8' },
  'Plantado':        { bg: '#1e3a5f', cor: '#60a5fa' },
  'Em crescimento':  { bg: '#14532d', cor: '#4ade80' },
  'Colhido':         { bg: '#422006', cor: '#fb923c' },
};

const STATUS_ICONE: any = {
  'Planejado':      '📋',
  'Plantado':       '🌱',
  'Em crescimento': '🌿',
  'Colhido':        '🌾',
};

export default function Safra() {
  const [filtro, setFiltro] = useState('Todos');
  const [fazendaFiltro, setFazendaFiltro] = useState('Todas');

  const fazendas = ['Todas', ...Array.from(new Set(SAFRAS.map(s => s.fazenda)))];
  const status = ['Todos', 'Planejado', 'Plantado', 'Em crescimento', 'Colhido'];

  const filtradas = SAFRAS.filter(s =>
    (filtro === 'Todos' || s.status === filtro) &&
    (fazendaFiltro === 'Todas' || s.fazenda === fazendaFiltro)
  );

  const totalArea = filtradas.reduce((a, s) => a + s.area, 0);
  const totalSacas = filtradas.reduce((a, s) => a + s.real, 0);
  const colhidas = filtradas.filter(s => s.status === 'Colhido').length;

  return (
    <div>
      <h2 style={{marginBottom:4}}>🌱 Safra 2024/2025</h2>
      <p style={{color:'#94a3b8', fontSize:13, marginBottom:24}}>Soja e Milho — 5 fazendas</p>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px,1fr))', gap:12, marginBottom:24}}>
        {[
          {label:'Área total', val:`${totalArea.toLocaleString()} ha`, cor:'#F97316'},
          {label:'Sacas colhidas', val:totalSacas > 0 ? totalSacas.toLocaleString() : '—', cor:'#22c55e'},
          {label:'Safras colhidas', val:`${colhidas}/${filtradas.length}`, cor:'#fb923c'},
          {label:'Culturas', val:'Soja / Milho', cor:'#a855f7'},
        ].map(c => (
          <div key={c.label} style={{background:'#1e293b', borderRadius:10, padding:'16px'}}>
            <div style={{color:'#94a3b8', fontSize:12, marginBottom:6}}>{c.label}</div>
            <div style={{color:c.cor, fontWeight:700, fontSize:18}}>{c.val}</div>
          </div>
        ))}
      </div>

      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:16}}>
        {status.map(s => (
          <button key={s} onClick={() => setFiltro(s)} style={{padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, background: filtro === s ? '#F97316' : '#1e293b', color: filtro === s ? '#fff' : '#94a3b8'}}>
            {s}
          </button>
        ))}
      </div>

      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:20}}>
        {fazendas.map(f => (
          <button key={f} onClick={() => setFazendaFiltro(f)} style={{padding:'5px 12px', borderRadius:20, border:'1px solid #334155', cursor:'pointer', fontSize:11, background: fazendaFiltro === f ? '#334155' : 'transparent', color: fazendaFiltro === f ? '#fff' : '#64748b'}}>
            {f}
          </button>
        ))}
      </div>

      <div style={{display:'grid', gap:12}}>
        {filtradas.map((s, i) => {
          const sc = STATUS_COR[s.status];
          return (
            <div key={i} style={{background:'#1e293b', borderRadius:12, padding:'20px 24px', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:16, alignItems:'center'}}>
              <div>
                <div style={{color:'#F97316', fontWeight:700, fontSize:13}}>{s.fazenda}</div>
                <div style={{color:'#e2e8f0', fontSize:15, fontWeight:600, marginTop:2}}>{STATUS_ICONE[s.status]} {s.cultura}</div>
              </div>
              <div>
                <div style={{color:'#64748b', fontSize:11}}>Área</div>
                <div style={{color:'#e2e8f0', fontWeight:600}}>{s.area.toLocaleString()} ha</div>
              </div>
              <div>
                <div style={{color:'#64748b', fontSize:11}}>Plantio</div>
                <div style={{color:'#e2e8f0', fontWeight:600}}>{s.plantio}</div>
              </div>
              <div>
                <div style={{color:'#64748b', fontSize:11}}>Colheita</div>
                <div style={{color:'#e2e8f0', fontWeight:600}}>{s.colheita}</div>
              </div>
              <div>
                <div style={{color:'#64748b', fontSize:11}}>Produt.</div>
                <div style={{color:'#e2e8f0', fontWeight:600}}>{s.prod} sc/ha</div>
              </div>
              <div>
                <span style={{background:sc.bg, color:sc.cor, padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:700}}>
                  {s.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
