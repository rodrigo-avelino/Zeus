const mongoose = require('../database');

const CachorroSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: false,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    compras: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Compra',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


const Cachorro = mongoose.model('Cachorro', CachorroSchema);

module.exports = Cachorro;