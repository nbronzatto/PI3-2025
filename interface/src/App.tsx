import React, { useState } from 'react';
import { Copy, Send, RefreshCw, MessageSquare } from 'lucide-react';


export type SocialChannel = 'Instagram' | 'Facebook' | 'TikTok' | 'Site';

export interface FormData {
  segment: string;
  product: string;
  target: string;
  problem: string;
  solution: string;
  channel: SocialChannel;
}

export interface GeneratedPost {
  hook: string;
  problem: string;
  solution: string;
  cta: string;
}

const initialFormData: FormData = {
  segment: '',
  product: '',
  target: '',
  problem: '',
  solution: '',
  channel: 'Instagram',
};

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Chama a API para gerar o post utilizando os dados do formulário
      const post = await fetchGeneratedPost(formData);
      setGeneratedPost(post);
    } catch (error) {
      console.error("Erro na geração do post:", error);
      // Aqui você pode implementar feedback visual para o usuário
    }
  };

  const handleCopy = async () => {
    if (!generatedPost) return;
    
    const text = `${generatedPost.hook}\n\n${generatedPost.problem}\n\n${generatedPost.solution}\n\n${generatedPost.cta}`;
    
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setGeneratedPost(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f9ff] p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#005f99] mb-4">
            Gerador de Conteúdo para Posts em Redes Sociais
          </h1>
          <p className="text-[#333] text-lg">
            Crie posts de alta qualidade em poucos minutos! Preencha o formulário abaixo e gere
            automaticamente um conteúdo otimizado para o seu público-alvo.
          </p>
        </header>

        {!generatedPost ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="grid gap-6 mb-6">
              <div>
                <label htmlFor="segment" className="block text-[#333] font-medium mb-2">
                  Segmento de Atuação
                </label>
                <input
                  type="text"
                  id="segment"
                  name="segment"
                  value={formData.segment}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f99]"
                  placeholder="Ex: Loja de Roupas Fitness"
                />
              </div>

              <div>
                <label htmlFor="product" className="block text-[#333] font-medium mb-2">
                  Produto ou Serviço
                </label>
                <input
                  type="text"
                  id="product"
                  name="product"
                  value={formData.product}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f99]"
                  placeholder="Ex: Conjunto de academia de secagem rápida"
                />
              </div>

              <div>
                <label htmlFor="target" className="block text-[#333] font-medium mb-2">
                  Público-Alvo
                </label>
                <input
                  type="text"
                  id="target"
                  name="target"
                  value={formData.target}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f99]"
                  placeholder="Ex: Mulheres que praticam exercícios físicos regularmente"
                />
              </div>

              <div>
                <label htmlFor="problem" className="block text-[#333] font-medium mb-2">
                  Problema do Cliente
                </label>
                <input
                  type="text"
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f99]"
                  placeholder="Ex: desconforto durante os treinos"
                />
              </div>

              <div>
                <label htmlFor="solution" className="block text-[#333] font-medium mb-2">
                  Solução Oferecida
                </label>
                <input
                  type="text"
                  id="solution"
                  name="solution"
                  value={formData.solution}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f99]"
                  placeholder="Ex: máximo conforto e liberdade de movimento"
                />
              </div>

              <div>
                <label htmlFor="channel" className="block text-[#333] font-medium mb-2">
                  Canal de Publicação
                </label>
                <select
                  id="channel"
                  name="channel"
                  value={formData.channel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#005f99]"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Site">Site</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#005f99] hover:bg-[#004877] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Gerar Conteúdo
            </button>
          </form>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fade-in">
            <div className="mb-6 space-y-4">
              <div>
                <h3 className="font-bold text-[#005f99] mb-2">Hook</h3>
                <p className="text-[#333]">{generatedPost.hook}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#005f99] mb-2">Problema</h3>
                <p className="text-[#333]">{generatedPost.problem}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#005f99] mb-2">Solução</h3>
                <p className="text-[#333]">{generatedPost.solution}</p>
              </div>
              <div>
                <h3 className="font-bold text-[#005f99] mb-2">Call to Action</h3>
                <p className="text-[#333]">{generatedPost.cta}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCopy}
                className="flex-1 bg-[#005f99] hover:bg-[#004877] text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Copy size={20} />
                {copied ? 'Copiado!' : 'Copiar Texto'}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw size={20} />
                Gerar Novo Post
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;