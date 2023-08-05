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
        const {nome, descricao, altura, largura, valorUtilidade, minimoProdutos, maximoProdutos} = request.body;

        if(!nome)
            return response.status(400).json({error: "Informe o nome do produto"});
        
        if(!descricao)
            return response.status(400).json({error: "Informe uma descrição para o produto"});
        
        if(!altura)
            return response.status(400).json({error: "Informe a altura do produto"});
        
        if(!largura)
            return response.status(400).json({error: "Informe a largura do produto"});
        
        if(!valorUtilidade)
            return response.status(400).json({error: "valor de utilidade não informado"});
        
        if(!minimoProdutos)
            return response.status(400).json({error: "Informe o numero mínimo de frentes para o produto informado"});
        
        if(!maximoProdutos)
            return response.status(400).json({error: "numero máximo de produtos não informado"});
        

        //instanciar um novo produto
        const produto = new Produto ({
            _id: uuid(), 
            nome,
            descricao,
            altura,
            largura,
            valorUtilidade,
            minimoProdutos,
            maximoProdutos
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
    },

    async atualiza(request, response) {
        const {descricao, altura, largura, valorDeUtilidade, numeroMinimoDeProdutos, numeroMaximoDeProdutos} = request.body;

        if (descricao) response.produto.descricao = descricao;
        if (altura) response.produto.altura = altura;
        if (largura) response.produto.largura = largura;
        if (valorDeUtilidade) response.produto.valorDeUtilidade = valorDeUtilidade;
        if (numeroMinimoDeProdutos) response.produto.numeroMinimoDeProdutos = numeroMinimoDeProdutos;
        if (numeroMaximoDeProdutos) response.produto.numeroMaximoDeProdutos = numeroMaximoDeProdutos;

        try {
            await response.produto.save();
            return response.status(200).json({ message: "Produto atualizado com sucesso!" });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    async exclui(request, response) {
        try {
            await response.produto.deleteOne();
            return response.status(200).json({ message: "Produto excluído com sucesso!" });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}