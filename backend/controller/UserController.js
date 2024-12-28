const User = require("../modele/user");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jaweherncir1234";
const bcrypt = require("bcrypt");
module.exports.getUser= async (req,res) =>{
    try {
        const user = await User.findById(req.params.id);  // Find user by ID
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        res.status(200).json({ user });
    
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
      }

}
//register
module.exports.addUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required: username, email, and password." });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Validate password length
        if (password.length < 3 || password.length > 10) {
            return res.status(400).json({ message: "Password must be between 3 and 10 characters." });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT with user ID
        const token = jwt.sign(
            { userId: newUser._id }, // Include `userId` to match client expectations
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set cookie with token
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.status(201).json({ message: "User added successfully.", token, userId: newUser._id });
    } catch (error) {
        console.error("Error adding new user:", error);
        return res.status(500).json({ message: "An error occurred while adding the user." });
    }
};
//login
module.exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required." });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid username or password." });
        }

        // Generate JWT with user ID
        const token = jwt.sign(
            { userId: user._id }, // Include `userId` to match client expectations
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Set cookie with token
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        return res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({ message: "An error occurred during login." });
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

        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error logging out user:", error);
        return res.status(500).json({ message: "An error occurred during logout" });
    }
};


