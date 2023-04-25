const mongoose = require("mongoose");

const planogramaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    usuario:{
        type: String,
        required: true
    },
    gondula: {
        type: String,
        required: true
    }    
});

module.exports = mongoose.model("Planograma", planogramaSchema);