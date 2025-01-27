import express from "express";
import connectToDatabase from "../config/dbConfig.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import middleWares from "../middlewares/authMiddleware.js";

dotenv.config();

const routes = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to the API" });
    });

    app.post("/register", async (req, res) => {
        const { name, email, password } = req.body;

        try {
            // Conecta ao banco de dados e acessa a coleção
            const mongoClient = await connectToDatabase();
            const db = mongoClient.db("taskManager"); // Nome do banco
            const collection = db.collection("users"); // Nome da coleção

            // Criptografa a senha antes de salvar
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insere os dados no MongoDB
            const result = await collection.insertOne({ name, email, password: hashedPassword });
            console.log("Documento inserido:", result);

            res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
        } catch (error) {
            console.error("Erro ao salvar no MongoDB:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    });

    app.post("/login", async (req, res) => {
        const { name, password } = req.body;

        try {
            const mongoClient = await connectToDatabase();
            const db = mongoClient.db("taskManager");
            const collection = db.collection("users");

            const user = await collection.findOne({ name });

            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            // Verifica a senha
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            // Gera o token
            const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, { expiresIn: "1h" });

            // Caso sucesso
            res.status(200).json({ message: "Login bem-sucedido!", token});
        } catch (error) {
            console.error("Erro ao buscar no MongoDB:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        }
    });

    app.get("/tasks", middleWares.authenticateToken, async (req, res) => {
        const { name } = req.user;

        try {
            const mongoClient = await connectToDatabase();
            const db = mongoClient.db("taskManager");
            const collection = db.collection("users");

            const user = await collection.findOne({ name }, { projection: { tasks: 1, _id: 0 } });

            if (!user || !user.tasks) {
                return res.status(404).json({ error: "Usuário não encontrado/Tarefas não encontradas." });
            }

            res.status(200).json({ success: true, message: "Tarefas carregadas com sucesso!", tasks: user.tasks });
        } catch (error) {
            console.error("Erro ao buscar no MongoDB:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        };
});

    app.post("/tasks/add", middleWares.authenticateToken, async (req, res) => {
        const { task } = req.body;
        const { name } = req.user;

        try {
            const mongoClient = await connectToDatabase();
            const db = mongoClient.db("taskManager");
            const collection = db.collection("users");

            if (!task) {
                return res.status(400).json({ message: "Tarefa inválida!" });
            }

            const result = await collection.updateOne(
                { name }, // Filtro para encontrar o usuário
                { $push: { tasks: { task, createdAt: new Date() } } } // Adiciona a tarefa ao array `tasks`
            );

            if (result.modifiedCount > 0) {
                res.status(200).json({ success: true, message: 'Tarefa adicionada com sucesso' });
            } else {
                res.status(500).json({ error: 'Erro ao adicionar a tarefa' });
            }
        } catch (error) {
            console.error("Erro ao salvar no MongoDB:", error);
            res.status(500).json({ message: "Erro interno no servidor." });
        };
    });
};

export default routes;
