import express from "express";

const routes = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get("/", (req, res) => {
        res.json({ message: "Welcome to the API" });
    });

    app.post("/register", (req, res) => {
        const { user, email, password } = req.body;

        res.json({ message: "Registrado com sucesso!" });
    });
};

export default routes;
