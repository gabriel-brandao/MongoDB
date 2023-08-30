const {response} = require("express");
const {v4: uuid} = require("uuid");
const Categoria = require("../models/Categoria");

//objeto que conteem todas as funções que são necessárias para se chamar na routes

module.exports = {
    //função assincrona, aguarda a resposta
   async index(request, response){
        try{
            //(await) - aguarda a resposta
            const categorias = await Categoria.find().sort({ nome: 1 });
            const categoriasCount = await Categoria.find().count();
            if (categoriasCount)
                //retorna para o cliente a requisição feita
                return response.status(200).json({ found: true, categorias });
            else
                return response.json({ found: false, msg: "<p style='color: #f00'>Não foi encontrada nenhuma categoria</p>" })
        } 
         catch(err) {
            response.status(500).json({error: err.message});
        }
    },

    //rota de criação
    async cadastra (request, response){
        //corpo da requisição (info obrigatórias)
        const {nome, tipo, valorPorArea, larguraMinima, larguraMaxima, orientacao} = request.body;

        if(!nome)
            return response.status(400).json({error: "nome não informado"});
        
        if(!tipo)
            return response.status(400).json({error: "tipo de categoria não informado"});
        
        if(!valorPorArea)
            return response.status(400).json({error: "valor por região não informado"});

        if(!larguraMinima)
            return response.status(400).json({error: "largura mínima não informada"});
        
        if(!larguraMaxima)
            return response.status(400).json({error: "largura máxima não informada"});
        
        //instanciar uma nova categoria
        const categoria = new Categoria ({
            _id: uuid(), 
            nome,
            tipo,
            valorPorArea,
            larguraMinima,
            larguraMaxima,
            orientacao,
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
    },

    async atualiza(request, response) {
        const {nome, tipo, valorPorArea, larguraMinima, larguraMaxima, orientacao} = request.body;

        response.categoria.nome = nome;
        response.categoria.tipo = tipo;
        response.categoria.valorPorArea = valorPorArea;
        response.categoria.larguraMinima = larguraMinima;
        response.categoria.larguraMaxima = larguraMaxima;
        response.categoria.orientacao = orientacao;

        try {
            await response.categoria.save();
            return response.status(200).json({ message: "Categoria atualizada com sucesso!" });
        } catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    async atualizaProdutos(request, response) {
        const { produtoId, operacao } = request.body;
        if (operacao == "cadastro") {
            response.categoria.produtos.push(produtoId);
        } else if (operacao == "remove") {
            var pos = response.categoria.produtos.indexOf(produtoId);
            response.categoria.produtos.splice(pos, 1);
        }

        try {
            await response.categoria.save();
            return response.status(200).json({ message: "Produtos atualizados com sucesso!" });
        } catch (err) {
            response.status(400).json({ error: err.message });
        }
    },

    async exclui(request, response) {
        try {
            await response.categoria.deleteOne();
            return response.status(200).json({ message: "Categoria excluída com sucesso!" });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}