const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    stock: { type: Number, required: true }
});

// Plugin de paginación
productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);


