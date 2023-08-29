const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,//obrigatório
    },
    nome: {
        type: String, 
        required: true
    },
    tipo: {
        type: String, 
        required: true
    },
    valorPorArea: {
        type: Array, // id
        default: [60,100,50]
    },
    produtos: {
        type: Array, // id
        default: []
    },
    larguraMinima: {
        type: Number, //double
        required: true
    }, 
    larguraMaxima: {
        type: Number, //double
        required: true
    },
    orientacao: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("Categoria", categoriaSchema);