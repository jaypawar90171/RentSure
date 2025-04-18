const mongoose = require('mongoose');
const dotenv = require('dotenv');

const DB_URL = process.env.DB_URL || 'mongodb://localhost:27017/RentSure';

mongoose.connect(DB_URL)
.then(() => {

    console.log('Connected to MongoDB successfully!');
}).catch((err) => {

    console.log(err)
})