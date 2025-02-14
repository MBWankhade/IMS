import User from "../db/model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username });   

        const isMatch = await bcrypt.compare(password, user.password); 

        if (user) {
            if (isMatch) {
                const token = jwt.sign({
                    id: user._id,
                }, process.env.JWT_SECRET);
                res.cookie("token", token);
                return res.status(200).send({ message: "login success", data: token });
            } else {
                return res.status(401).send({message: "Incorrect Password."});
            }
        } else {
            return res.status(404).send({message: "Invalid Credentials."});
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
        const { name, email, username, password, confirmPassword } = req.body;

        // Check if required fields are provided
        if (!name || !email || !username || !password || !confirmPassword) {
            return res.status(400).send({ message: "All fields are required." });
        }

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).send({ message: "Password and confirm password do not match." });
        }

        // Check if password is at least 8 characters long
        if (password.length < 8) {
            return res.status(400).send({ message: "Password must be at least 8 characters long." });
        }

        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).send({ message: "Username already exists. Please choose another username." });
        }

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).send({ message: "Email already exists. Please use another email." });
        }

        // Hash the password
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create a new user
        const user = new User({
            name,
            email,
            username,
            password: hashedPassword, // Store the hashed password
        });

        // Save the user to the database
        await user.save();

        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id }, // Payload
            process.env.JWT_SECRET, // Secret key
            { expiresIn: "1h" } // Token expiration time
        );

        // Set the token in a cookie
        res.cookie("token", token, {
            httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Ensure cookies are only sent over HTTPS in production
            maxAge: 3600000, // 1 hour in milliseconds
        });

        // Return success response
        return res.status(201).send({
            message: "User registered successfully.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        console.error("Error during signup:", error);
        return res.status(500).send({ message: "Internal server error. Please try again later." });
    }
};