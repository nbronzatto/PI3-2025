const express = require('express');
const { connectDB } = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');


// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Conectar ao banco de dados
connectDB();


// Inicializar o app Express
const app = express();

// Middleware para analisar JSON
app.use(express.json());
app.use(cors())


// Incluir as rotas
app.use('/newpost', require('./routes/postRoutes'));


// Porta do servidor
const PORT = process.env.PORT || 5000;


// Iniciar o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));