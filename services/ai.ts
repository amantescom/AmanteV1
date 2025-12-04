import { GoogleGenAI } from "@google/genai";

// Chave fornecida para o projeto dev-acolyte-480118-e7
const HARDCODED_KEY = "AIzaSyAae50KSUnuFM9h0IvKaORM4R3i4Li3clk";

const getAIClient = () => {
  // Tenta pegar do ambiente, senão usa a chave fixa do projeto
  const apiKey = process.env.API_KEY || HARDCODED_KEY;
  
  if (!apiKey) {
    console.error("API Key não encontrada.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

const FALLBACK_COMMENTS = [
  "Maravilhosa! 🔥",
  "Simplesmente perfeita.",
  "Que olhar hipnotizante...",
  "Musa inspiradora ✨",
  "Sem palavras! 😍"
];

const FALLBACK_BIOS = [
  "Vivendo intensamente cada momento.",
  "Sua melhor distração favorita.",
  "Bem-vindo ao meu mundo secreto.",
  "Permita-se sentir mais."
];

export const generateWittyComment = async (context: string): Promise<string> => {
  const ai = getAIClient();
  
  if (!ai) {
    return FALLBACK_COMMENTS[Math.floor(Math.random() * FALLBACK_COMMENTS.length)];
  }

  const prompt = `Escreva um comentário curto, sedutor ou engraçado para uma rede social adulta (em Português do Brasil) sobre uma foto com o contexto: ${context}. Máximo 15 palavras. Emojis permitidos.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text?.replace(/"/g, '') || FALLBACK_COMMENTS[0];
  } catch (error) {
    console.warn("AI Generation failed, using fallback.", error);
    return FALLBACK_COMMENTS[Math.floor(Math.random() * FALLBACK_COMMENTS.length)];
  }
};

export const generateBio = async (name: string, vibe: string): Promise<string> => {
  const ai = getAIClient();

  if (!ai) {
    return FALLBACK_BIOS[Math.floor(Math.random() * FALLBACK_BIOS.length)];
  }

  const prompt = `Crie uma bio curta, misteriosa e atraente para rede social (em Português do Brasil) para um modelo chamado ${name}. Vibe: ${vibe}. Máximo 20 palavras.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || FALLBACK_BIOS[0];
  } catch (error) {
    return FALLBACK_BIOS[Math.floor(Math.random() * FALLBACK_BIOS.length)];
  }
};