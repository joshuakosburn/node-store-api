const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A product name is required!']
    },

    price: {
        type: Number,
        required: [true, 'A product price is required!']
    },

    featured: {
        type: Boolean,
        default: false
    },

    rating: {
        type: Number,
        default: 0
    },

    company: {
        type: String,
        enum: {
            values: [
                'ikea',
                'liddy',
                'caressa',
                'marcos'
            ],
            message: '{VALUES} is not supported!'
        },
    },

    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Product', productSchema);