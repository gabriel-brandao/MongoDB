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
    nome: {
        type: String,
        required: true
    },
    descricao:{
        type: String,
        required: true
    },
    categoria:{
        type: Object,
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
    valorUtilidade: {
        type: Number, //double
        required: true
    }, 
    minimoProdutos: {
        type: Number, //int
        required: true
    },
    maximoProdutos: {
        type: Number, //int
        required: true
    }
    
});

module.exports = mongoose.model("Produto", produtoSchema);