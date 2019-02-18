var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


router.get("/",function(req, res){
  res.render("landing");
});


//======AUTH Routes========

//show
router.get("/register", function(req, res) {
   res.render("register"); 
});

//handle signup logic
router.post("/register", function(req, res) {
   var newUser = new User({username: req.body.username});
   User.register(newUser, req.body.password, function(err, user){
     if(err){
       console.log(err);
       return res.render("register");
     }
     passport.authenticate("local")(req,res, function(){
       res.redirect("/campgrounds");
     });
   });
});

// Show Login Form
router.get("/login", function(req, res) {
  res.render("login", {message : req.flash("error")});    
});

router.post("/login", passport.authenticate("local", 
  {
   successRedirect : "/campgrounds",
   failureRedirect : "/login"
  }), function(req, res) {
  
});

//log out 
router.get("/logout", function(req, res) {
   req.logout();//session ends
   res.redirect("/campgrounds");
});

//MIDDLEWARE
function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
   return next();
 }
 res.redirect("/login");
}

module.exports = router;