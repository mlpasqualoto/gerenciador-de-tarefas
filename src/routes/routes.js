import express from "express";
import connectToDatabase from "../config/dbConfig.js";

const routes = (app) => {
    connectToDatabase();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to the API" });
    });

    app.post("/register", async (req, res) => {
        const { user, email, password } = req.body;

        try {
            // Insere os dados no MongoDB
            const result = await collection.insertOne({ user, email, password });
            console.log('Documento inserido:', result);

            res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            console.error('Erro ao salvar no MongoDB:', error);
            res.status(500).json({ message: 'Erro interno no servidor.' });
        }
    });
};

export default routes;
