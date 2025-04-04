const express = require('express');
const axios = require('axios');
const router = express.Router();

// Obtém a chave da API do ambiente
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Chave da API não definida. Verifique a variável de ambiente GEMINI_API_KEY.");
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Rota para gerar um post de marketing
router.post('/', async (req, res) => {
  try {
    const { segment, product, target, problem, solution } = req.body;

    // Valida os campos obrigatórios
    if (!segment || !product || !target || !problem || !solution) {
      return res.status(400).json({ error: "Todos os campos são obrigatórios." });
    }

    // Monta o prompt
    const prompt = `
Crie um post para redes sociais com base nas seguintes informações:

Segmento: ${segment}
Produto: ${product}
Público-alvo: ${target}
Problema: ${problem}
Solução: ${solution}

O post deve seguir este formato:
**1. Hook:** Uma frase curta e impactante para chamar atenção (use emojis)
**2. Problema:** Explicação clara do problema do cliente
**3. Solução:** Como o produto resolve o problema
**4. (CTA):** Chamada para ação incentivando o engajamento

Mantenha o texto envolvente, persuasivo e adequado para redes sociais.
Use emojis apropriados para tornar o texto mais atraente.
Limite cada seção a 2-3 linhas no máximo.
    `;

    const requestData = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    };

    const response = await axios.post(GEMINI_URL, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      return res.status(500).json({ error: "A resposta da API não contém o conteúdo esperado." });
    }

    // Divide a resposta em seções
    const sections = textResponse.split('\n\n');
    const generatedPost = {
      hook: sections[0]?.replace("**1. Hook:**", "").trim() || "",
      problem: sections[1]?.replace("**2. Problema:**", "").trim() || "",
      solution: sections[2]?.replace("**3. Solução:**", "").trim() || "",
      cta: sections[3]?.replace("**4. (CTA):**", "").trim() || "",
    };

    res.json(generatedPost);
  } catch (error) {
    console.error("Erro ao gerar post:", error);
    res.status(500).json({ error: "Erro ao processar a solicitação." });
  }
});

module.exports = router;
