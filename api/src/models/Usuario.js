const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    cpf: {
        type: String,
        required: true,
    },
    nome:{
        type: String,
        required: true
    },
    // Verificar método de criptografia de senha para não armazenar no banco
    // Segurança do usuário
    senha: { 
        type: String, 
        required: true
    }, 
    privilegio: {
        type: String,
        required: true
    }    
    
});

module.exports = mongoose.model("Usuario", usuarioSchema);