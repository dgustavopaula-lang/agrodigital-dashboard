import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const FAZENDAS = [
  { nome: 'Fazenda do Lago',     lat: -18.7731, lng: -50.5406, cidade: 'São Simão, GO' },
  { nome: 'Fazenda Saudade',     lat: -19.0731, lng: -50.4806, cidade: 'Paranaiguara, GO' },
  { nome: 'Fazenda Pateirinho',  lat: -18.8231, lng: -50.5806, cidade: 'São Simão, GO' },
  { nome: 'Fazenda Santa Luzia', lat: -19.1231, lng: -50.5106, cidade: 'Paranaiguara, GO' },
  { nome: 'Fazenda Pipe',        lat: -9.5354,  lng: 16.3411,  cidade: 'Malanje, Angola' },
];

export default function MapaFazendas() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: [-18.9, -50.5],
      zoom: 7,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const icon = L.divIcon({
      className: '',
      html: `<div style="
        background:#F97316;
        border:3px solid #fff;
        border-radius:50%;
        width:18px;
        height:18px;
        box-shadow:0 2px 8px rgba(0,0,0,0.4);
      "></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    FAZENDAS.forEach(f => {
      L.marker([f.lat, f.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:160px">
            <strong style="color:#F97316;font-size:14px">${f.nome}</strong><br/>
            <span style="color:#666;font-size:12px">${f.cidade}</span>
          </div>
        `);
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
          <h3 style={{ color: '#F97316', fontWeight: 700, fontSize: 16, margin: 0 }}>
            Mapa das Fazendas
          </h3>
          <p style={{ color: '#94a3b8', fontSize: 13, margin: '4px 0 0' }}>
            5 propriedades — Brasil e Angola
          </p>
        </div>
        <div ref={mapRef} style={{ height: 480, width: '100%' }} />
      </div>
    </div>
  );
}
