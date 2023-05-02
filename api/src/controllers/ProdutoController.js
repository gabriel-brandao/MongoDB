const {response} = require("express");
const {v4: uuid} = require("uuid")
const Produto = require("../models/Produto");

//objeto que conteem todas as funções que são necessárias para se chamar na routes

module.exports = {
    //função assincrona, aguarda a resposta
   async index(request, response){
        try{
            //(await) - aguarda a resposta
            const produtos = await Produto.find();

            //retorna para o cliente a requisição feita
            return response.status(200).json({produtos});
        } 
         catch(err) {
            response.status(500).json({error: err.message});
        }
    },

    //rota de criação
    async cadastra (request, response){
        //corpo da requisição (info obrigatórias)
        const {categoria, descricao, altura, largura, valorDeUtilidade, numeroMinimoDeProdutos, numeroMaximoDeProdutos} = request.body;

        if(!categoria)
            return response.status(400).json({error: "categoria não informada"});
        
        if(!descricao)
            return response.status(400).json({error: "descrição não informada"});
        
        if(!altura)
            return response.status(400).json({error: "altura não informada"});
        
        if(!largura)
            return response.status(400).json({error: "largura não informada"});
        
        if(!valorDeUtilidade)
            return response.status(400).json({error: "valor de utilidade não informado"});
        
        if(!numeroMinimoDeProdutos)
            return response.status(400).json({error: "numero mínimo de produtos não informado"});
        
        if(!numeroMaximoDeProdutos)
            return response.status(400).json({error: "numero máximo de produtos não informado"});
        

        //instanciar um novo produto
        const produto = new Produto ({
            _id: uuid(), 
            categoria,
            descricao,
            altura,
            largura,
            valorDeUtilidade,
            numeroMinimoDeProdutos,
            numeroMaximoDeProdutos
        });

        try{
            //tenta salvar no BD
            await produto.save();

            return response.status(201).json({message: "Produto cadastrado com Sucesso !!"});
        }
         catch (err){
            //caso der errado
            response.status(400).json({error: err.message});
         }
    }
}