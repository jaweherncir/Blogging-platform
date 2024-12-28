const Post = require('../modele/post'); // Adjust the path to your Post model
const User = require('../modele/user'); // Adjust the path to your User model if needed
const mongoose = require('mongoose');
const postId = new mongoose.Types.ObjectId(); // Example for generating a new ObjectId

module.exports.newPost = async (req, res) => {
  try {
      const { content, userId } = req.body;

      // Validate input
      if (!content || !userId) {
          return res.status(400).json({ message: "Content and user ID are required" });
      }

      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Create a new post
      const newPost = await Post.create({
          content,
          user: userId,
      });

      // Populate the user details in the response for better UI integration
      const populatedPost = await Post.findById(newPost._id).populate('user', 'username');

      res.status(201).json({
          message: "Post added successfully",
          post: populatedPost,
      });
  } catch (error) {
      console.error("Error creating new post:", error);
      res.status(500).json({ message: "An error occurred while creating the post" });
  }
};

module.exports.getAllPosts = async (req, res) => {
    try {
        // Fetch all posts with user details and reviews (avis)
        const posts = await Post.find()
            .populate('user', 'username email') // Include user details (e.g., username and email)
            .populate('avis.user', 'username email') // Include reviewer details (e.g., username and email)
            .sort({ datePosted: -1 }); // Sort by latest posts

        res.status(200).json({ message: "Posts fetched successfully", posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "An error occurred while fetching posts" });
    }
};
module.exports.getPostById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the post by ID, populate user and avis fields
        const post = await Post.findById(id)
            .populate('user', 'username email') // Include user details (e.g., username and email)
            .populate('avis.user', 'username email'); // Include reviewer details (e.g., username and email)

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        res.status(200).json({ message: "Post fetched successfully", post });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: "An error occurred while fetching the post" });
    }
};
exports.getAllPostsByUser = async (req, res) => {
  try {
      const userId = req.params.id;
      const posts = await Post.find({ user: userId }).populate("user avis.user");
      
      if (!posts) {
          return res.status(404).json({ message: "No posts found for this user" });
      }

      res.status(200).json(posts);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
module.exports.updatePost = async (req, res) => {
    try {
        const { id } = req.params; // Post ID
        const { titrePost, content } = req.body; // New data for the post

        // Find the post to update
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

    

        // Update the post fields
        if (titrePost) post.titrePost = titrePost;
        if (content) post.content = content;

        // Save the updated post
        await post.save();

        res.status(200).json({ message: "Post updated successfully", post });
    } catch (error) {
        console.error("Error updating post:", error);
        res.status(500).json({ message: "An error occurred while updating the post" });
    }
};
module.exports.deletePost = async (req, res) => {
    try {
      const postId = req.params.id;
  
      // Find the post by ID
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
  
      // Delete the post
      await Post.findByIdAndDelete(postId);
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
module.exports.addComment = async (req, res) => {
    try {
      const postId = req.params.id;
      const { user, comment } = req.body;
  
      // Validate inputs
      if (!user || !comment || comment.trim().length === 0) {
        return res.status(400).json({ message: "User and comment are required" });
      }
  
      // Find the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Add the comment
      const newComment = {
        user, // User ID from the request body
        comment,
      };
      post.avis.push(newComment);
  
      // Save the post
      await post.save();
  
      res.status(201).json({ message: "Comment added successfully", post });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
exports.deleteComment = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
  
      // Find the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Find and remove the comment
      post.avis = post.avis.filter(comment => comment._id.toString() !== commentId);
  
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: "Comment deleted successfully", post });
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
exports.updateComment = async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const { comment } = req.body;
  
      // Validate inputs
      if (!comment || comment.trim().length === 0) {
        return res.status(400).json({ message: "Comment content is required" });
      }
  
      // Find the post
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      // Find the comment and update it
      const commentIndex = post.avis.findIndex(c => c._id.toString() === commentId);
      if (commentIndex === -1) {
        return res.status(404).json({ message: "Comment not found" });
      }
  
      post.avis[commentIndex].comment = comment;
  
      // Save the updated post
      await post.save();
  
      res.status(200).json({ message: "Comment updated successfully", post });
    } catch (error) {
      console.error("Error updating comment:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
exports.getAllComments = async (req, res) => {
        try {
        const postId = req.params.id;
    
        // Find the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
    
        res.status(200).json({ message: "Comments fetched successfully", comments: post.avis });
        } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Internal server error" });
        }
    };
exports.getCommentById = async (req, res) => {
        try {
          const { postId, commentId } = req.params;
      
          // Find the post
          const post = await Post.findById(postId).populate('avis.user', 'username email');  // Populate user details
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
      
          // Find the comment by its ID
          const comment = post.avis.id(commentId);
          if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
          }
      
          res.status(200).json({ comment });
        } catch (error) {
          console.error("Error getting comment:", error);
          res.status(500).json({ message: "Internal server error" });
        }
    };
exports.likePost = async (req, res) => {
      try {
          const postId = req.params.id;
  
          // Find the post
          const post = await Post.findById(postId);
          if (!post) {
              return res.status(404).json({ message: "Post not found" });
          }
  
          // Toggle the like status
          post.like = !post.like;
  
          // Save the updated post
          await post.save();
  
          // Return a JSON response
          res.status(200).json({ message: "Post liked successfully", post });
      } catch (error) {
          console.error("Error liking post:", error);
          res.status(500).json({ message: "Internal server error" });
      }
  };
  
exports.dislikePost = async (req, res) => {
        try {
          const postId = req.params.id;
      
          // Find the post
          const post = await Post.findById(postId);
          if (!post) {
            return res.status(404).json({ message: "Post not found" });
          }
      
          // Toggle the like status
          post.like = !post.like;
      
          // Save the updated post
          await post.save();
      
          res.status(200).json({ message: "Post disliked successfully", post });
        } catch (error) {
          console.error("Error disliking post:", error);
          res.status(500).json({ message: "Internal server error" });
        }
    };

      

  
  
  