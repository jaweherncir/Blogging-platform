const express = require("express");
const router = express.Router();
const userCntrl = require("../controller/UserController");

// Route pour ajouter un utilisateur

router.post('/addUser',userCntrl.addUser )
router.post('/login',userCntrl.loginUser )
router.post('/logout',userCntrl.logoutUser )
router.get('/getUser/:id',userCntrl.getUser )
module.exports = router;