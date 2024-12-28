const express = require("express");
const router = express.Router();
const PostCntrl = require("../controller/PostController");
const authenticateUser=require("../controller/authenticateUser")
// Route pour ajouter un utilisateur

router.post('/addPost',PostCntrl.newPost )
// Route to get all posts
router.get('/getAllPosts', PostCntrl.getAllPosts);
//get all post for oneuser
router.get('/getAllPosts/:id', PostCntrl.getAllPostsByUser);
// Route to get a single post by ID
router.get('/getPostById/:id', PostCntrl.getPostById);
// Route to update a post
router.put('/updatePost/:id', PostCntrl.updatePost);
router.delete("/deletePost/:id", PostCntrl.deletePost);
router.post("/addComment/:id", PostCntrl.addComment);
router.delete("/:postId/comments/:commentId", PostCntrl.deleteComment);
router.put("/:postId/comments/:commentId", PostCntrl.updateComment);
router.get('/getAllComment/:id',PostCntrl.getAllComments )
router.get('/:postId/comments/:commentId',PostCntrl.getCommentById )
router.post('/likePost/:id',PostCntrl.likePost )
router.post('/dislikePost/:id',PostCntrl.dislikePost )




module.exports = router;