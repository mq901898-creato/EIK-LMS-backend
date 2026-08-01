const mongoose = require("mongoose"); 
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongodb connected');
    }catch(err){
        console.error(err.message);
    }
};

module.exports = connectDB;