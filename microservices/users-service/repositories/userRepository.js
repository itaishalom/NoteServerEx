const UserDB = require("../models/userDb");
const db = require("./remote_datasource/db");


class UserRepository {
    constructor() {
        db() // TODO should await..
    }
    async createUser(user, callback) {
        const new_user = await UserDB.create(user)
        callback(null, new_user);
    }

    findUserByEmail(email, callback) {
        this.findUserByEmailInner(email).then(
            user => {
                if (user) {
                    callback(null, user);
                } else {
                    callback(null, null);
                }
            }
        )
    }

    async findUserByEmailInner(email) {
        try {
            return await UserDB.findOne({email: email});
        } catch (error) {
            console.error('Error finding user:', error);
            throw error;
        }
    }
}


module.exports = UserRepository;
