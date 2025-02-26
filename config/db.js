const mongoose = require("mongoose")
const colors = require("colors")

const connectDB = async () =>{
    try{
        await mongoose.connect(process.env.MongoURL)
        console.log(`Connected to MongoDB DataBase ${mongoose.connection.host}`.bgMagenta.white)
    }catch(error){
        console.error(`MongoDB connection Error ${error.message}`.bgRed.white);
    }
}

module.exports = connectDB;