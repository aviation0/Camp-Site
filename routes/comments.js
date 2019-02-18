var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campgrounds");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW route for comments
router.get("/new", middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground){
    if(err){
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
  //lookup campground using ID
  Campground.findById(req.params.id, function(err, campground) {
     if(err){
       console.log(err);
       res.redirect("/campgrounds");
     } else {
       //create a new comment
       Comment.create(req.body.comment, function(err, comment){
         if(err){
           console.log(err);
         } else {
            //add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            //save comment
            comment.save();
            //connect a new comment to campgrounds
            campground.comments.push(comment);
            campground.save();
            //redirect campground show page
            res.redirect("/campgrounds/" + campground._id);
         }
       });
     }
  });
});

//EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
       if(err){
            res.redirect("back");
       } else{
             res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});   
       }
    });
});

//UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res) {
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err){
        res.redirect("back");
    } else {
        res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

//DELETE COMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
   Comment.findByIdAndRemove(req.params.comment_id, function(err){
      if(err) {
          res.redirect("back");
      } else{
          res.redirect("/campgrounds/" + req.params.id);
      }
   });
});


module.exports = router;