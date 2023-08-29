const { validate: isUuid } = require("uuid");
const Gondula = require("../models/Gondula");

module.exports = {
    async validarId(request, response, next) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const gondula = await Gondula.findById(id);
            response.gondula = gondula;
            if (!gondula) {
                return response.status(404).json({ error: "Gondula não encontrada." });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    },

    async obterGondula(request, response) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const gondula = await Gondula.findById(id);
            if (!gondula) {
                return response.status(404).json({ error: "Gôndula não encontrada." });
            } else {
                return response.status(200).json({ gondula: gondula });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }
    },

    async gondulaPlan(idGondula) {
        const gondula = await Gondula.findById(idGondula).lean();
        return gondula;
    }
}