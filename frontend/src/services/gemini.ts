const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = 'gemini-2.0-flash';
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export function geminiConfigurado(): boolean {
  return Boolean(API_KEY && API_KEY.length > 10);
}

export async function perguntarGemini(pergunta: string, contexto?: string): Promise<string> {
  if (!geminiConfigurado()) {
    return 'IA não configurada. Adicione a variável VITE_GEMINI_API_KEY.';
  }

  const prompt = contexto
    ? `Você é o assistente do AgroDigital. Responda em português, de forma curta e prática.\n\nDados:\n${contexto}\n\nPergunta: ${pergunta}`
    : `Você é o assistente do AgroDigital. Responda em português, de forma curta e prática.\n\nPergunta: ${pergunta}`;

  const isBearer = API_KEY!.startsWith('AQ.');

  try {
    const res = await fetch(isBearer ? URL : `${URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(isBearer ? { 'Authorization': `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 500, temperature: 0.4 },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return `Erro na IA (${res.status}): ${err?.error?.message || 'Tente novamente.'}`;
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sem resposta da IA.';
  } catch {
    return 'Falha de conexão com a IA.';
  }
}
