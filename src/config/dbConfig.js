import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let mongoClient;

export default async function connectToDatabase() {
    const uri = `mongodb+srv://matheuspasqualoto:${process.env.DB_PASSWORD}@taskmanager.whkyz.mongodb.net/?retryWrites=true&w=majority&appName=taskManager`;
    
    try {
        mongoClient = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        console.log('Conectando ao cluster do banco de dados...');

        await mongoClient.connect();
        console.log('Conectado ao MongoDB Atlas com sucesso ao banco de dados');

        return mongoClient;
    } catch (error) {
        console.log('Erro ao conectar no banco de dados', error);
        throw new Error('Não foi possível conectar ao MongoDB.');
    };
};
