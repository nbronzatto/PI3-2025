import axios from 'axios';
import { MongoClient } from 'mongodb';
import { FormData, GeneratedPost } from './types';

export async function fetchGeneratedPost(data: FormData): Promise<GeneratedPost> {
  // Acessa a chave da API através do import.meta.env
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("Chave da API não definida. Verifique sua variável de ambiente VITE_GEMINI_API_KEY.");
  }

  // URL da API conforme o modelo do Gemini
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  // Cria o prompt com base nos dados do formulário
  const prompt = `
Crie um post para redes sociais com base nas seguintes informações:

Segmento: ${data.segment}
Produto: ${data.product}
Público-alvo: ${data.target}
Problema: ${data.problem}
Solução: ${data.solution}

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

  try {
    const response = await axios.post(url, requestData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const textResponse: string = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("A resposta da API não contém o conteúdo esperado.");
    }

    // Divide a resposta em seções
    const sections = textResponse.split('\n\n');
    console.log(sections);
    const generatedPost: GeneratedPost = {
      hook: sections[0]?.replace("**1. Hook:**", "").trim() || "",
      problem: sections[1]?.replace("**2. Problema:**", "").trim() || "",
      solution: sections[2]?.replace("**3. Solução:**", "").trim() || "",
      cta: sections[3]?.replace("**4. (CTA):**", "").trim() || "",
    };

    // Conecta ao MongoDB
    const dbUrl = import.meta.env.VITE_MONGOCONSTRING;
    const collectionName = import.meta.env.VITE_MONGOCOLLECTION;
    if (!dbUrl || !collectionName) {
      throw new Error("Detalhes de conexão do MongoDB não definidos.");
    }
    const client = new MongoClient(dbUrl);
    await client.connect();
    const db = client.db(); // Caso queira especificar o nome do banco, use db(dbName)
    const collection = db.collection(collectionName);

    // Estrutura do documento a ser inserido
    const document = {
      segmento: data.segment,
      produto: data.product,
      publico_alvo: data.target,
      problema: data.problem,
      solucao: data.solution,
      cta: generatedPost.cta,
      canal_publicacao: data.channel, // Considerando que 'channel' é do tipo SocialChannel
      criado_em: new Date(),
      generatedPost, // Opcional: armazenando também o objeto gerado
    };

    // Insere o documento na coleção
    await collection.insertOne(document);
    await client.close();

    return generatedPost;
  } catch (error) {
    console.error("Erro ao gerar post:", error);
    throw error;
  }
}