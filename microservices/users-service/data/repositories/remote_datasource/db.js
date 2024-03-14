const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {DATABASE_URL} = require("../../../config");

dotenv.config()

const db = async () => {
    try {
        const con = await mongoose.connect(DATABASE_URL)
        console.log('db connected')
    }catch (error){
        console.error(error)
    }
}

module.exports = db