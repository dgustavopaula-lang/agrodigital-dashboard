import { useState } from "react";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY || "";

export default function GeminiAssistente() {
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function perguntar() {
    if (!pergunta.trim()) return;
    setCarregando(true);
    setResposta("");
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Você é um assistente agrícola especialista em fazendas brasileiras e africanas. Responda em português: ${pergunta}` }] }]
          })
        }
      );
      const data = await res.json();
      setResposta(data.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta");
    } catch (e) {
      setResposta("Erro ao conectar com o Gemini.");
    }
    setCarregando(false);
  }

  return (
    <div style={{ background: "#1e293b", padding: "1.5rem", borderRadius: "12px", border: "1px solid #F97316" }}>
      <h3 style={{ color: "#F97316", marginBottom: "1rem" }}>🌱 Assistente AgroDigital (Gemini)</h3>
      <textarea
        value={pergunta}
        onChange={e => setPergunta(e.target.value)}
        placeholder="Ex: Qual a melhor época para plantar soja no Cerrado?"
        rows={3}
        style={{ width: "100%", background: "#0f172a", color: "#fff", border: "1px solid #334155", borderRadius: "8px", padding: "0.75rem", fontSize: "0.9rem" }}
      />
      <button
        onClick={perguntar}
        disabled={carregando}
        style={{ marginTop: "0.75rem", background: "#F97316", color: "#fff", border: "none", borderRadius: "8px", padding: "0.6rem 1.5rem", cursor: "pointer", fontWeight: "bold" }}
      >
        {carregando ? "Consultando..." : "Perguntar"}
      </button>
      {resposta && (
        <div style={{ marginTop: "1rem", background: "#0f172a", padding: "1rem", borderRadius: "8px", color: "#e2e8f0", lineHeight: "1.6" }}>
          {resposta}
        </div>
      )}
    </div>
  );
}
