import { MongoClient } from 'mongodb';

export default async function connectToDatabase(stringConexao) {
    let mongoClient;

    try {
        mongoClient = new MongoClient(stringConexao);
        console.log('Conectando ao cluster do banco de dados...');

        await mongoClient.connect();
        console.log('Conectado ao MongoDB Atlas com sucesso ao banco de dados');

        return mongoClient;
    } catch (error) {
        console.log('Erro ao conectar no banco de dados', error);
        process.exit();
    };
};
