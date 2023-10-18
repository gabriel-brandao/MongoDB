const { response } = require("express");
const { v4: uuid } = require("uuid")
const Planograma = require("../models/Planograma");

module.exports = {
    
    async index(request, response) {
        try {

            //(await) - aguarda a resposta
            const planogramas = await Planograma.find().sort({ data_hora: -1 });
            const planogramasCount = await Planograma.find().count();
            //retorna para o cliente a requisição feita
            if (planogramasCount)
                return response.status(200).json({ found: true, planogramas });
            else
                return response.json({ found: false, msg: "<p style='color: #f00'>Não foi encontrado nenhum planograma</p>" });
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