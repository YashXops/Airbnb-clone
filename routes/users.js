const express = require("express");
const router = express.Router();
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js");


router.get("/signup", UserController.renderSignup);

router.post("/signup",UserController.signup);

router.get("/login",UserController.renderLogin);

router.post("/login", saveRedirectUrl,UserController.login);

router.get("/logout",UserController.logOut);

module.exports = router;