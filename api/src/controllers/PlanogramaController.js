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
    async cadastra(data) {
        
        data._id = uuid();

        //instanciar um novo planograma
        const planograma = new Planograma(data);

        try {
            //tenta salvar no BD
            await planograma.save();

            return;
        }
        catch (err) {
            //caso der errado
            throw err.message;
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