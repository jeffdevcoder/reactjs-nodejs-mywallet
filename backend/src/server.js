import dotenv from "dotenv";
import app from "./app.js";
dotenv.config();

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`Estou rodando na porta ${PORT}`));