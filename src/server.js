import express from "express";
import cors from "cors";
import routes from "./routes/routes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

routes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.25.193:${PORT}`);
});
