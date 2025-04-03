const mongoose = require('mongoose');

// Definição do schema para a coleção de campanhas de marketing
const PostsMarketingSchema = new mongoose.Schema({
    segmento: { type: String, required: true },
    produto: { type: String, required: true },
    publico_alvo: { type: String, required: true },
    problema: { type: String, required: true },
    solucao: { type: String, required: true },
    cta: { type: String, required: true },
    canal_publicacao: { type: String, required: true },
    criado_em: { type: Date, default: Date.now } // Define a data atual caso não seja fornecida
});

module.exports = mongoose.model('Posts', PostsMarketingSchema);