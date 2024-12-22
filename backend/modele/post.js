const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    titrePost: {
        type: String,
        required: [true, "The title of the post is required"],
        trim: true,
        minlength: [1, "The title cannot be empty"],
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
    avis: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            comment: { type: String, trim: true },
            rating: { type: Number, min: 1, max: 5 },
            date: { type: Date, default: Date.now },
        },
    ],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
