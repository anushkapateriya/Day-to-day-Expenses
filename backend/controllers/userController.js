const User = require("../models/user");

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        
        const existingUser = await User.findOne({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = await User.create({
            name: name,
            email: email,
            password: password
        });

        res.status(201).json({
            message: "User created successfully",
            user: user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

const login = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                message: "User not authorized"
            });
        }

        res.status(200).json({
            message: "User login successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
};

module.exports = {
    signup,
    login
};

