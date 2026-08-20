const express = require("express");
const router = express.Router();
const User = require("../models/User.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup", (req,res) => {
    res.render("users/signup.ejs");
})

router.post("/signup", async (req, res, next) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
});

router.get("/login", (req,res) => {
    res.render("users/login.ejs");
});

router.post("/login",
            saveRedirectUrl,
            passport.authenticate("local",
                {failureRedirect: "/login" , 
                 failureFlash: true}) ,async (req,res) => {
                    req.flash("success", "Welcome Back!");
                    let redirectUrl = res.locals.redirectUrl;
                    if(redirectUrl) {
                        return res.redirect(redirectUrl);
                    }
                    res.redirect("/listings");
});

router.get("/logout", (req,res) => {
    req.logOut((err) => {
        if(err) return next(err);
        req.flash("success","Logged Out Successfully.");
        res.redirect("/listings");
    })
});

module.exports = router;