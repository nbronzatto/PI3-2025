const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Adicione esta linha para importar o módulo 'path'

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Conectar ao banco de dados
connectDB();

// Inicializar o app Express
const app = express();

// Middleware para analisar JSON
app.use(express.json());
app.use(cors());

// Incluir as rotas da API (MUITO IMPORTANTE: estas rotas devem vir ANTES da configuração do frontend)
app.use('/newpost', require('./routes/postRoutes'));
app.use('/newprompt', require('./routes/geminiRoutes'));

// --- INÍCIO DA CONFIGURAÇÃO PARA SERVIR O FRONTEND ---

// Caminho para a pasta 'build' do seu frontend
// Assumindo que a pasta 'interface' está no mesmo nível que 'backend'
const frontendBuildPath = path.join(__dirname, '..', 'interface', 'build');

// Servir arquivos estáticos do frontend
// Isso fará com que o Express sirva os arquivos HTML, CSS, JS, etc. da pasta 'build'
app.use(express.static(frontendBuildPath));

// Para Single Page Applications (SPA) como React Router:
// Redireciona todas as requisições que não são de API para o index.html do frontend.
// Isso permite que o React Router lide com o roteamento no lado do cliente.
app.get('/*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

// --- FIM DA CONFIGURAÇÃO PARA SERVIR O FRONTEND ---

// Porta do servidor
const PORT = process.env.PORT || 5000;

// Iniciar o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));


