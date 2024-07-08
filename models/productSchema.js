const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    // Define fields a/c structure of the JSON data
    product_id: Number,
    transaction_id: Number,
    quantity: Number,
    price: Number,
})

const ProductCollection = mongoose.model('Task01_Products', productSchema);
module.exports = ProductCollection;

console.log('Product Model/Schema Created.');