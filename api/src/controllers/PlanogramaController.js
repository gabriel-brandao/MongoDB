const { response } = require("express");
const { v4: uuid } = require("uuid")
const Planograma = require("../models/Planograma");

module.exports = {
    async index(request, response) {
        try {
            const planogramas = await Planograma.find();

            return response.status(200).json({ planogramas });
        }
        catch (err) {
            response.status(500).json({ error: err.message });
        }
    },

    //rota de criação
    async cadastra(request, response) {
        //corpo da requisição (info obrigatórias)
        const { usuario, gondula } = request.body;

        if (!gondula)
            return response.status(400).json({ error: "voce precisa informar uma gondula" });


        //instanciar um novo planograma
        const planograma = new Planograma({
            _id: uuid(),
            usuario,
            gondula
        });

        try {
            //tenta salvar no BD
            await planograma.save();

            return response.status(201).json({ message: "Planograma gerado com Sucesso !!" });
        }
        catch (err) {
            //caso der errado
            response.status(400).json({ error: err.message });
        }
    },

    async exclui(request, response) {
        try {
            await response.planograma.deleteOne();
            return response.status(200).json({ message: "Planograma excluído com sucesso!" });
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },
}