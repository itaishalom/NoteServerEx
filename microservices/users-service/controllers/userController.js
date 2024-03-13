const UserRepository = require('../repositories/userRepository');
const User = require('../models/User');

const userRepository = new UserRepository();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require("../config");


const loginUser = (req, res) => {
    const {email, password} = req.body;
    try {
        userRepository.findUserByEmail(email, async (err, user) => {
            if (err) {
                return res.status(500).json({message: 'Error finding user'});
            }
            if (!user) {
                return res.status(401).json({message: 'Invalid email or password'});
            }

            try {
                if (await bcrypt.compare(password, user.password)) {
                    const accessToken = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'});

                    res.json({accessToken});
                } else {
                    res.status(401).json({message: 'Invalid email or password'});
                }
            } catch (error) {
                res.status(500).json({message: 'Error comparing passwords'});
            }
        });
    } catch (error) {
        // Logger..
        throw error
    }
};


const addUser = (req, res) => {
    const {email, password} = req.body;
    try {
        userRepository.findUserByEmail(email, async (err, existingUser) => {
            if (err) {
                return res.status(500).json({message: 'Error finding user'});
            }
            if (existingUser) {
                return res.status(400).json({message: 'User already exists'});
            }

            const newUser = new User(email, await bcrypt.hash(password, 10));

            await userRepository.createUser(newUser, (err, user) => {
                if (err) {
                    return res.status(500).json({message: 'Error creating user'});
                }
                res.status(201).json({message: 'User created successfully', user});
            });
        });
    } catch (error) {
        // Logger..
        throw error
    }
};

module.exports = {
    addUser, loginUser
};
