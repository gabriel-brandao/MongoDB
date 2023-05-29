//Models são os arquivos que irão obter dados do banco de dados

//schema são instaciações do javaScript

const mongoose = require("mongoose");

//maneira como os dados são organizados no mongo (abstrai para um objeto no JS)
const gondulaSchema = new mongoose.Schema({

    _id: {
        type: String,
        required: true// (obrigatório) - ID será uma abstração (responsabilidade) do back-end
    },
    largura: {
        type: Number, //double
        required: true
    }, 
    quantidadeDeNiveis: {
        type: Number, //Integer
        required: true
    }
    
});

module.exports = mongoose.model("Gondula", gondulaSchema);