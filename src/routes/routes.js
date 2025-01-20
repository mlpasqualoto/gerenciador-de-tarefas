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
            // Conecta ao banco de dados e acessa a coleção
            const mongoClient = await connectToDatabase();
            const db = mongoClient.db("taskManager"); // Nome do banco
            const collection = db.collection("users"); // Nome da coleção

            // Insere os dados no MongoDB
            const result = await collection.insertOne({ user, email, password });
            console.log("Documento inserido:", result);

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
        } catch (error) {
            console.error("Erro ao salvar no MongoDB:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    });
};

export default routes;
