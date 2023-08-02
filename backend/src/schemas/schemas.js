import mongoose from "mongoose";

export const usuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
});

export const sessaoSchema = new mongoose.Schema({
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    token: { type: String, required: true },
});

export const registroSchema = new mongoose.Schema({
    valor: { type: Number, required: true },
    descricao: { type: String, required: true },
    tipo: { type: String, required: true },
    data: { type: String, required: true },
    idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
    nome: { type: String, required: true },
});

