const mongoose = require('../database');

const CompraSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    cachorro: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Cachorro',
        require: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})


const Compra = mongoose.model('Compra', CompraSchema);

module.exports = Compra;