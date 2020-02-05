var express = require("express"),
	router = express.Router(),
	Photo = require("../models/photo"),
	User = require("../models/user"),
	middleware = require("../middleware");
	

router.get("/", function(req, res){
     //get camps from the db;
	Photo.find({} , function(err, allPhotos){
		if(err){
			console.log(err);
		} else{
			 res.render("photos/index", {photos: allPhotos , currentUser: req.user});
		}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var image = req.body.image;
	var avatar = req.user.avatar;
	var desc = req.body.description,
		author = {
			id: req.user._id,
			username: req.user.username,
			avatar: req.user.avatar,
		};
	var newPhotos = {name: name, image: image, description: desc, author: author, avatar:avatar};
	Photo.create(newPhotos, function(err, newlyCreated){
		if(err){
			cosole.log(err);
		} else{
			res.redirect("/galleries");
		}
	});
});

router.get("/new",middleware.isLoggedIn, function(req, res){
	res.render("photos/new");
});

// SHOW route
router.get("/:id", function(req, res){
	Photo.findById(req.params.id).populate("comments").exec(function(err, foundPhotos){
		if(err){
			console.log(err);
		} else{
			console.log(foundPhotos);
			res.render("photos/show", {photo: foundPhotos});
		}
	});
});

// Edit Photos
router.get("/:id/edit",middleware.checkPhotoOwnership, function(req, res){
	Photos.findById(req.params.id, function(err, foundPhotos){
		res.render("photos/edit", {photo: foundPhotos});
	});
});

// Update route
router.put("/:id",middleware.checkPhotoOwnership, function(req,res) {
	Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhotos){
		if(err){
			res.redirect("/galleries");
		} else {
			res.redirect("/galleries/" + req.params.id);
		}
	});
});

// Destroy route
router.delete("/:id",middleware.checkPhotoOwnership, function(req, res){
	Photo.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/galleries");
      } else {
          res.redirect("/galleries");
      }
	});
});


module.exports = router;