const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    category: String,
    tags: String
}, {
    timestamps: true
});
module.exports = mongoose.model('Item', ItemSchema);
