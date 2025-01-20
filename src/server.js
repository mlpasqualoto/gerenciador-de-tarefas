import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Routes

app.listen(PORT, () => {
    console.log(`Server is running on http://192.168.25.193:${PORT}`);
});
