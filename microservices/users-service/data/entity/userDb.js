const mongoose = require('mongoose')
const UserSchema = mongoose.Schema({
    email: {
        require: true,
        type: String
    },
    password: {
        require: true,
        type: String
    }
})

const UserDB = mongoose.model('UserDB', UserSchema)
module.exports = UserDB