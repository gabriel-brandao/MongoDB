const { validate: isUuid } = require("uuid");
const Planograma = require("../models/Planograma");

module.exports = {
    async validarId(request, response, next) {
        const { id } = request.params;

        if (!isUuid(id)) {
            return response.status(400).json({ error: "ID inválido!" });
        }

        try {
            const planograma = await Planograma.findById(id);
            response.planograma = planograma;
            if (!planograma) {
                return response.status(404).json({ error: "Planograma não encontrado." });
            }
        } catch (err) {
            return response.status(500).json({ error: err.message });
        }

        next();
    }
}