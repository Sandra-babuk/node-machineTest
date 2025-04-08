const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:
    {
        type: String,
        required: true
    },
    description: String,
    price:
    {
        type: Number,
        required: true
    },
    category:
    {
        type: String,
        required: true
    },
    brand:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
    productImage: String,
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
