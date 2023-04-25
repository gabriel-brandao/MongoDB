//Models são os arquivos que irão obter dados do banco de dados

//schema são instaciações do javaScript

const mongoose = require("mongoose");

//maneira como os dados são organizados no mongo (abstrai para um objeto no JS)
const produtoSchema = new mongoose.Schema({
    //
    _id: {
        type: String,
        required: true,// (obrigatório) - ID será uma abstração (responsabilidade) do back-end
    },
    categoria: {
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    altura: {
        type: Number, //double
        required: true
    }, 
    largura: {
        type: Number, //double
        required: true
    },
    valorDeUtilidade: {
        type: Number, //double
        required: true
    }, 
    numeroMinimoDeProdutos: {
        type: Number, //int
        required: true
    },
    numeroMaximoDeProdutos: {
        type: Number, //int
        required: true
    }
    
});

module.exports = mongoose.model("Produto", produtoSchema);