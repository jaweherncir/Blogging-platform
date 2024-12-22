const User = require("../modele/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jaweherncir1234";
const bcrypt = require("bcrypt");
module.exports.getUser= async (req,res) =>{
    try {
        const user = await User.findById(req.params.id).select('-password'); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user); 
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }

}
//regisrer 
module.exports.addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res
                .status(400)
                .json({ message: "All inputs are required fields: username, email, and password" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 3 || password.length > 10) {
            return res
                .status(400)
                .json({ message: "Password must be between 3 and 10 characters" });
        }

        const newUser = new User({
            username,
            email,
            password,
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Save token in an HTTP-only cookie
        res.cookie("auth_token", token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === "production", // Ensures cookies are sent only over HTTPS in production
            sameSite: "strict", // Helps prevent CSRF attacks
            maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
        });

        res.status(201).json({
            message: "User added successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Error adding new user:", error);
        res.status(500).json({ message: "An error occurred while adding the user" });
    }
};
//login
module.exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" } // Token expires in 1 hour
        );

        // Save token in an HTTP-only cookie
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        // Respond with user details
        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "An error occurred during login" });
    }
};
//logout
module.exports.logoutUser = (req, res) => {
    try {
        // Clear the cookie containing the JWT
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "An error occurred during logout" });
    }
};
