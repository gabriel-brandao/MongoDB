const {response} = require("express");
const {v4: uuid} = require("uuid")
const Produto = require("../models/Categoria");
const Categoria = require("../models/Categoria");

//objeto que conteem todas as funções que são necessárias para se chamar na routes

module.exports = {
    //função assincrona, aguarda a resposta
   async index(request, response){
        try{
            //(await) - aguarda a resposta
            const categorias = await Categoria.find();

            //retorna para o cliente a requisição feita
            return response.status(200).json({categorias});
        } 
         catch(err) {
            response.status(500).json({error: err.message});
        }
    },

    //rota de criação
    async cadastra (request, response){
        //corpo da requisição (info obrigatórias)
        const {gondula, larguraMinima, larguraMaxima, isHorizontal} = request.body;

        if(!gondula)
            return response.status(400).json({error: "gondula não informada"});
        
        if(!larguraMinima)
            return response.status(400).json({error: "largura mínima não informada"});
        
        if(!larguraMaxima)
            return response.status(400).json({error: "largura máxima não informada"});
        
        if(!isHorizontal)
            return response.status(400).json({error: "Orientação(vertical/horizontal) não informado"});

        //instanciar um novo produto
        const categoria = new Categoria ({
            _id: uuid(), 
            gondula,
            larguraMinima,
            larguraMaxima,
            isHorizontal
        });

        try{
            //tenta salvar no BD
            await categoria.save();

            return response.status(201).json({message: "Categoria cadastrada com Sucesso !!"});
        }
         catch (err){
            //caso der errado
            response.status(400).json({error: err.message});
         }
    }
}