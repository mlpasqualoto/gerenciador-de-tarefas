import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const middleWares = {
    authenticateToken: (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Token não fornecido!" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Token inválido!" });
            }

            req.user = user; // Adiciona os dados do token à requisição
            next();
        });
    },
};

export default middleWares;
