import User from "../db/model.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username });

        if (user) {
            if (user.password === password) {
                const token = jwt.sign({
                    id: user._id,
                }, process.env.JWT_SECRET);
                res.cookie("token", token);
                return res.status(200).send({ message: "login success", data: token });
            } else {
                return res.status(401).send("password incorrect");
            }
        } else {
            return res.status(404).send("user not found");
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error");
    }
}

export const logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
}

export const signup = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;

        const u = await User.findOne({ username: username });

        if (u) {
            return res.status(409).send("username already exists ");
        }

        const user = new User({
            name,
            email,
            username,
            password,
        });

        await user.save();

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET);
        res.cookie("token", token);
        return res.status(201).send({ message: "user registered successfully", data: token });
    } catch (error) {
        console.log(error);
        return res.status(500).send("internal server error");
    }
}

