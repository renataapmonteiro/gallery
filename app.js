var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	Photo = require("./models/photo"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

var commentRoutes = require("./routes/comments"),
	photoRoutes = require("./routes/photos"),
	authRoutes = require("./routes/index");
	

mongoose.connect("mongodb://localhost/mygallery", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// PASSPORT configuration
app.use(require("express-session")({
	secret: "i was in love with taemin",
	resave: false,
	saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.sucess = req.flash("sucess");
	next();
});

// requiring routes
app.use(authRoutes);
app.use("/galleries", photoRoutes);
app.use("/galleries/:id/comments", commentRoutes);



app.listen(3000, process.env.PORT, process.env.IP, function(){
	console.log("My Gallery is on Air!!!!");
});