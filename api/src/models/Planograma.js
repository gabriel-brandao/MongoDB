const mongoose = require("mongoose");

const planogramaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    usuario:{
        type: String,
        required: true
    },
    gondula: {
        type: String,
        required: true
    },
    no_modulos: Number,
    modulos: [{
        categoria: Number,
        largura: Number,
        no_niveis: Number,
        niveis: [{
            altura: Number,
            tipos_itens: Number,
            itens: [Number],
            quantidade: [Number]
        }]
    }]    
});

module.exports = mongoose.model("Planograma", planogramaSchema);