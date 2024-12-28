const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: [1, "Username cannot be empty"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [/.+@.+\..+/, "email ne pas valide"], 
    unique: true 
  },
  password: {
    type: String,
    required: [true, "password obligatoir"],
 
  },
  lastname:{
    type: String,
   default: ' anonyme',
  },
  Contact:{
    type: String,
    default: ' 00 216 20 113 786',
  },
  dateBrth:{
    type: Date,
    default: Date.now,
  },
  Gender:{
    type: String,
    default: 'homme',
  },
  City:{
    type: String,
    default: 'Tunis',
  },
});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt); 
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;