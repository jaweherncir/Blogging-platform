const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    titrePost: {
        type: String,
       default: "My Post",
      
    },
    content: {
        type: String,
        required: [true, "Content is required (Text , image or video URL)"],
        trim: true,
    },
    datePosted: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "The user who created the post is required"],
    },
    like: { type: Boolean, default: false },
    avis: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, trim: true },
            date: { type: Date, default: Date.now },
        },
       
    ],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
