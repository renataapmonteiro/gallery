var express = require("express"),
	router = express.Router(),
	passport = require("passport"),
	User = require("../models/user");

router.get("/", function(req, res){
	res.render("photos/landing");
});

router.get("/show", function(req, res){
	console.log(username);
});

// AUTH Routes

// show the register form
router.get("/register", function(req, res){
	res.render("register");
});

// handle sing up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username, avatar: req.body.avatar});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/galleries");
		});
	});
});

// show login form
router.get("/login", function(req, res){
	res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/galleries",
        failureRedirect: "/login"
    }), function(req, res){
});

// log out logic
router.get("/logout", function(req, res){
	req.logout();
	req.flash("sucess", "Logged you out!");
	res.redirect("/galleries");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;