const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    // Certifique-se de que as variáveis de ambiente estão definidas corretamente
    const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    console.log(mongoURI);
    // Conecta ao MongoDB
    await mongoose.connect(mongoURI);
    console.log('MongoDB conectado!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1); // Encerra o processo em caso de erro de conexão
  }
};


// Exporte tanto o connectDB quanto o mongoose
module.exports = {
  connectDB,
  mongoose
};
