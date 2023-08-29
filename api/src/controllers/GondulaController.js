const { response } = require("express");
const { v4: uuid } = require("uuid")
const Gondula = require("../models/Gondula");

//objeto que conteem todas as funções que são necessárias para se chamar na routes

module.exports = {
    //função assincrona, aguarda a resposta
    async index(request, response) {
        try {

            //(await) - aguarda a resposta
            const gondulas = await Gondula.find().sort({ nome: 1 });
            const gondulasCount = await Gondula.find().count();
            //retorna para o cliente a requisição feita
            if (gondulasCount)
                return response.status(200).json({ found: true, gondulas });
            else
                return response.json({ found: false, msg: "<p style='color: #f00'>Não foi encontrada nenhuma gôndula</p>" });
        }
        catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    //rota de criação
    async cadastra(request, response) {
        // Corpo da requisição (info obrigatórias)
        const { nome, categorias, altura, largura, quantidadeDeNiveis, regioes } = request.body;
    
        if (!nome)
            return response.status(400).json({ error: "Informe um nome" });
        
        if (!categorias)
            return response.status(400).json({ error: "Selecione categorias" });
        
        if (!altura)
            return response.status(400).json({ error: "Altura não informada" });
    
        if (!largura)
            return response.status(400).json({ error: "Largura não informada" });
    
        if (!quantidadeDeNiveis)
            return response.status(400).json({ error: "Quantidade de níveis não informada" });
    
        if (!regioes || regioes.length !== parseInt(quantidadeDeNiveis) || !regioes.every(val => [0, 1, 2].includes(val)))
            return response.status(400).json({ error: "Regiões dos níveis não informadas corretamente" });
    
        // Instanciar um novo produto
        const gondula = new Gondula({
            _id: uuid(),
            nome,
            categorias,
            altura,
            largura,
            quantidadeDeNiveis,
            regioes
        });
    
        try {
            // Tenta salvar no BD
            await gondula.save();
    
            return response.status(201).json({ message: "Gondula cadastrada com Sucesso !!" });
        }
        catch (err) {
            // Caso der errado
            response.status(400).json({ error: err.message });
        }
    },

    async atualiza(request, response) {
        const { nome, categorias, altura, largura, quantidadeDeNiveis, regioesNiveis } = request.body;
        
        response.gondula.nome = nome;
        response.gondula.categorias = categorias;
        response.gondula.altura = altura;
        response.gondula.largura = largura;
        response.gondula.quantidadeDeNiveis = quantidadeDeNiveis;
        response.gondula.regioes = regioesNiveis;

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