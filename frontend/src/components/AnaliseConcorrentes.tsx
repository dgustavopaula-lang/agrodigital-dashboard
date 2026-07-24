export default function AnaliseConcorrentes() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <div style={{ background: '#1e293b', border: '1px solid #F97316', borderRadius: '12px', padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
        <h2 style={{ color: '#F97316', marginBottom: '1rem' }}>Análise de Concorrentes</h2>
        <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
          Relatório completo: Aegro, Solinftec, Agrotools, Climate FieldView e oportunidades.
        </p>
        <button
          onClick={() => window.open('/concorrentes.html', '_blank')}
          style={{ background: '#F97316', color: '#fff', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
        >
          Abrir Relatório Completo →
        </button>
      </div>
    </div>
  );
}
