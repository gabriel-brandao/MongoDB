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
    }
}