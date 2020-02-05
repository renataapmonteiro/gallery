var express = require("express"),
	router = express.Router({mergeParams: true}),
	Photo = require("../models/photo"),
	Comment = require("../models/comment"),
	middleware = require("../middleware");

// ==============================================
// COMMENTS Routes

// new comment
router.get("/new",middleware.isLoggedIn, function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {photo: photo});
			
		}
	});
});

// creating a comment
router.post("/new",middleware.isLoggedIn, function(req, res){
	Photo.findById(req.params.id, function(err, photo){
		if(err){
			console.log(err);
			res.redirect("/galleries");
		} else {
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else {
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					photo.comments.push(comment);
					photo.save();
					res.redirect('/galleries/' + photo._id);
				}
			});
		}
	});
});

// edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {photo_id: req.params.id, comment: foundComment});
      }
	});
});

// update route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/photos/" + req.params.id);
		}
	});
});

// Destroy route
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
 Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/galleries/" + req.params.id);
       }
    });
});


module.exports = router;