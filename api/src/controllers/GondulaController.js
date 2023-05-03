const {response} = require("express");
const {v4: uuid} = require("uuid")
const Gondula = require("../models/Gondula");

//objeto que conteem todas as funções que são necessárias para se chamar na routes

module.exports = {
    //função assincrona, aguarda a resposta
   async index(request, response){
        try{
            
            //(await) - aguarda a resposta
            const gondula = await Gondula.find();

            //retorna para o cliente a requisição feita
           
            return response.status(200).json({gondula});
        } 
         catch(err) {
            response.status(500).json({error: err.message});
        }
    },

    //rota de criação
    async cadastra (request, response){
        //corpo da requisição (info obrigatórias)
        const {largura, quantidadeDeNiveis} = request.body;

        if(!largura)
            return response.status(400).json({error: "largura não informada"});
        
        if(!quantidadeDeNiveis)
            return response.status(400).json({error: "Quantidade de níveis não informado"});
        
        //instanciar um novo produto
        const gondula = new Gondula ({
            _id: uuid(), 
            largura,
            quantidadeDeNiveis
        });

        try{
            //tenta salvar no BD
            await gondula.save();

            return response.status(201).json({message: "Gondula cadastrada com Sucesso !!"});
        }
         catch (err){
            //caso der errado
            response.status(400).json({error: err.message});
         }
    },

    async atualiza(request, response) {
        const {largura, quantidadeDeNiveis} = request.body;

        if (largura) response.gondula.largura = largura;
        if (quantidadeDeNiveis) response.gondula.quantidadeDeNiveis = quantidadeDeNiveis;

        try {
            await response.gondula.save();
            return response.status(200).json({ message: "Gondula atualizada com sucesso!" });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    async exclui(request, response) {
        try {
            await response.gondula.deleteOne();
            return response.status(200).json({ message: "Gondula excluída com sucesso!" });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}