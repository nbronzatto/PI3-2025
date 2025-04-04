const mongoose = require('mongoose');


const connectDB = async () => {
  try {
    const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    console.log('URI:', mongoURI);

    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB conectado!');

    // Lista as coleções disponíveis
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📂 Coleções disponíveis no banco:');
    collections.forEach((col) => console.log(` - ${col.name}`));

  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};


// Exporte tanto o connectDB quanto o mongoose
module.exports = {
  connectDB,
  mongoose
};
