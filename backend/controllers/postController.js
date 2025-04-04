const Post = require('../models/Post');

// Controlador para criar um novo post de marketing
console.log(Post);
exports.createPost = async (req, res) => {
  try {
    const { segmento, produto, publico_alvo, problema, solucao, cta, canal_publicacao } = req.body;
    
    // Criando um novo post de marketing
    const newPost = new Post({
      segmento,
      produto,
      publico_alvo,
      problema,
      solucao,
      cta,
      canal_publicacao
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar post de marketing', error });
  }
};