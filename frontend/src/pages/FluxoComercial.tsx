/* ============================================
   AGRODIGITAL — FLUXO COMERCIAL GPS.dev
   Página interna (área do administrador).
   Rota sugerida: /fluxo-comercial
   ============================================ */

const ETAPAS = [
  {
    icone: 'ri-user-add-line',
    titulo: 'Cliente novo aparece',
    tempo: '—',
    descricao: 'Indicação, blog, Instagram ou WhatsApp. Nenhum trabalho ainda.',
  },
  {
    icone: 'ri-stethoscope-line',
    titulo: 'Diagnóstico',
    tempo: '15 min',
    descricao: 'Três perguntas: o que você controla no papel hoje? O que mais toma tempo? Quantas pessoas vão usar?',
  },
  {
    icone: 'ri-slideshow-3-line',
    titulo: 'Demonstração ao vivo',
    tempo: '5 min',
    descricao: 'Sistema genérico do setor aberto no celular do próprio cliente. Ele vê funcionando. Custo: zero.',
  },
  {
    icone: 'ri-file-list-3-line',
    titulo: 'Proposta na hora',
    tempo: '5 min',
    descricao: '"Em 48h está no ar com seu nome e seus dados." Implantação + mensalidade. Fecha ou agenda retorno.',
  },
  {
    icone: 'ri-brush-line',
    titulo: 'Personalização',
    tempo: '20–40 min',
    descricao: 'Só depois do sim. Nome, logo, cores, módulos e 3 a 5 registros reais do cliente.',
    destaque: true,
  },
  {
    icone: 'ri-rocket-2-line',
    titulo: 'Publicação no Render',
    tempo: '10 min',
    descricao: 'URL própria do cliente. Teste no celular antes de enviar.',
  },
  {
    icone: 'ri-gift-line',
    titulo: 'Entrega formal',
    tempo: '10 min',
    descricao: 'Link + manual PDF de 1 página + vídeo de 2 minutos. Reduz o suporte depois.',
  },
  {
    icone: 'ri-chat-heart-line',
    titulo: 'Pós-venda em 7 dias',
    tempo: '5 min',
    descricao: '"Está usando? Alguma dúvida?" E o pedido de indicação para o próximo cliente do setor.',
  },
];

export default function FluxoComercial() {
  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px' }}>
      <header style={{ marginBottom: 8 }}>
        <span className="ag-badge"><i className="ri-route-line" /> Método GPS.dev</span>
        <h1 style={{ margin: '12px 0 4px', fontSize: 28 }}>Fluxo comercial</h1>
        <p style={{ color: 'var(--ag-text-dim)', margin: 0 }}>
          Do primeiro contato à assinatura. Trabalho pesado só depois do fechamento.
        </p>
      </header>

      {/* Resumo de tempos */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '24px 0' }}>
        <div className="ag-card" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ color: 'var(--ag-text-dim)', fontSize: 13 }}>Cliente que fecha</div>
          <div className="ag-display" style={{ fontSize: 26, color: 'var(--ag-accent)' }}>~1h30 total</div>
        </div>
        <div className="ag-card" style={{ flex: 1, minWidth: 200 }}>
          <div style={{ color: 'var(--ag-text-dim)', fontSize: 13 }}>Cliente que não fecha</div>
          <div className="ag-display" style={{ fontSize: 26 }}>20 min apenas</div>
        </div>
      </div>

      {/* Linha do tempo */}
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {ETAPAS.map((e, i) => (
          <li key={e.titulo} style={{ display: 'flex', gap: 16, position: 'relative' }}>
            {/* trilho vertical */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0,
                  background: e.destaque ? 'var(--ag-accent)' : 'var(--ag-surface-2)',
                  color: e.destaque ? '#fff' : 'var(--ag-accent)',
                  border: '1px solid var(--ag-border)',
                }}
              >
                <i className={e.icone} />
              </div>
              {i < ETAPAS.length - 1 && (
                <div style={{ width: 2, flex: 1, background: 'var(--ag-border)', minHeight: 24 }} />
              )}
            </div>

            <div className="ag-card" style={{ flex: 1, marginBottom: 16, borderColor: e.destaque ? 'var(--ag-accent)' : undefined }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: 17 }}>{i + 1}. {e.titulo}</h3>
                <span className="ag-badge">{e.tempo}</span>
              </div>
              <p style={{ margin: '8px 0 0', color: 'var(--ag-text-dim)', fontSize: 14, lineHeight: 1.5 }}>
                {e.descricao}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="ag-card" style={{ borderColor: 'var(--ag-accent)', marginTop: 8 }}>
        <strong style={{ color: 'var(--ag-accent)' }}><i className="ri-lightbulb-flash-line" /> Regra de ouro:</strong>{' '}
        cada "não" custa 20 minutos, nunca uma hora. A demonstração com sistema já publicado convence mais que qualquer promessa.
      </div>
    </div>
  );
}
