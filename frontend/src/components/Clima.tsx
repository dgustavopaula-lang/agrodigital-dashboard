import { useState, useEffect } from 'react';

const FAZENDAS = [
  { nome: 'Fazenda Saudade',    lat: -18.4167, lon: -50.6333, cidade: 'Paranaiguara, GO' },
  { nome: 'Fazenda do Lago',    lat: -18.4167, lon: -50.6333, cidade: 'Paranaiguara, GO' },
  { nome: 'Fazenda Pateirinho', lat: -18.4167, lon: -50.6333, cidade: 'Paranaiguara, GO' },
  { nome: 'Fazenda Santa Luzia',lat: -18.4167, lon: -50.6333, cidade: 'Paranaiguara, GO' },
  { nome: 'Fazenda Pipe',       lat: -9.5400,  lon: 16.3400,  cidade: 'Malanje, Angola' },
];

const API_KEY = 'cccbf941b67fa8629ee2187dd1451d';

function icone(codigo: string) {
  const c = codigo.substring(0, 2);
  if (c === '01') return '☀️';
  if (c === '02') return '🌤️';
  if (c === '03' || c === '04') return '☁️';
  if (c === '09' || c === '10') return '🌧️';
  if (c === '11') return '⛈️';
  if (c === '13') return '❄️';
  return '🌡️';
}

export default function Clima() {
  const [dados, setDados] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function buscar() {
      try {
        const resultados = await Promise.all(
          FAZENDAS.map(f =>
            fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${f.lat}&lon=${f.lon}&appid=${API_KEY}&units=metric&lang=pt_br`)
              .then(r => r.json())
              .then(d => ({ ...f, clima: d }))
          )
        );
        setDados(resultados);
      } catch {
        setErro('Erro ao buscar dados climáticos.');
      } finally {
        setCarregando(false);
      }
    }
    buscar();
  }, []);

  if (carregando) return <div style={{color:'#94a3b8', padding:32}}>Carregando dados climáticos...</div>;
  if (erro) return <div style={{color:'#f0f0f0', padding:32}}>{erro}</div>;

  return (
    <div>
      <h2 style={{marginBottom:8}}>🌦️ Clima por Fazenda</h2>
      <p style={{color:'#94a3b8', marginBottom:24, fontSize:13}}>Dados em tempo real — OpenWeatherMap</p>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:16}}>
        {dados.map((f, i) => {
          const c = f.clima;
          const ok = c && c.main;
          return (
            <div key={i} style={{background:'#1e293b', borderRadius:12, padding:24}}>
              <div style={{color:'#F97316', fontWeight:700, fontSize:14, marginBottom:4}}>{f.nome}</div>
              <div style={{color:'#64748b', fontSize:12, marginBottom:16}}>{f.cidade}</div>
              {ok ? (
                <>
                  <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16}}>
                    <span style={{fontSize:48}}>{icone(c.weather[0].icon)}</span>
                    <div>
                      <div style={{fontSize:36, fontWeight:700, color:'#fff'}}>{Math.round(c.main.temp)}°C</div>
                      <div style={{color:'#94a3b8', fontSize:13, textTransform:'capitalize'}}>{c.weather[0].description}</div>
                    </div>
                  </div>
                  <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
                    {[
                      {label:'Sensação', val:`${Math.round(c.main.feels_like)}°C`},
                      {label:'Umidade', val:`${c.main.humidity}%`},
                      {label:'Vento', val:`${Math.round(c.wind.speed * 3.6)} km/h`},
                      {label:'Pressão', val:`${c.main.pressure} hPa`},
                    ].map(item => (
                      <div key={item.label} style={{background:'#0f172a', borderRadius:8, padding:'8px 12px'}}>
                        <div style={{color:'#64748b', fontSize:11}}>{item.label}</div>
                        <div style={{color:'#e2e8f0', fontWeight:600, fontSize:14}}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{color:'#f0f0f0', fontSize:13}}>Dados indisponíveis</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
