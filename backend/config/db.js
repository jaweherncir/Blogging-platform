const mongoose = require("mongoose");
const uri = process.env.DB_URL;

mongoose.connect(uri, {
    useNewUrlParser: true,  // Still necessary for parsing the connection string
    useUnifiedTopology: true // Ensures better connection handling
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));