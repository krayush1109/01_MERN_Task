const mongoose = require('mongoose');

exports.connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/')
        console.log('Connected to database');
    } catch (err) {
        console.log(err);
    }
}