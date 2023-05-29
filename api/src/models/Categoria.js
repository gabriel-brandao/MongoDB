const mongoose = require("mongoose");

const categoriaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,//obrigatório
    },
    gondula: {
        type: String, //int
        required: true
    },
    larguraMinima: {
        type: Number, //double
        required: true
    }, 
    larguraMaxima: {
        type: Number, //double
        required: true
    },
    isHorizontal: {
        type: Boolean, //vertical(padrão)
        default: false
    }
});

module.exports = mongoose.model("Categoria", categoriaSchema);