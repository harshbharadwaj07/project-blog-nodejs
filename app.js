//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');



const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-harsh:"+process.env.MONGO_KEY+"@cluster0.pqd8uax.mongodb.net/userDB");

const postSchema=new mongoose.Schema({
  title:String,
  post:String,
  date:{type:Date,default:Date.now},
  postedbyid:String,
  postedby:String,
  comments:[
    {
      comment:String,
      commentby:String,
      commentdate:{type:Date,default:Date.now}
    }
  ]
});

const userSchema = new mongoose.Schema ({
  name:String,
  email: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Post=new mongoose.model("Post",postSchema);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.get("/", function(req, res){
  const loggedIn = req.isAuthenticated();
  res.render("start",{ loggedIn: loggedIn });
});

app.get("/login", function(req, res){
  const loggedIn = req.isAuthenticated();
  res.render("login",{loggedIn:loggedIn});
});

app.get("/register", function(req, res){
  const loggedIn = req.isAuthenticated();
  res.render("register",{loggedIn:loggedIn});
});

app.get("/pass", function(req, res){
  const loggedIn = req.isAuthenticated();
  res.render("pass",{loggedIn:loggedIn});
});

app.get("/user", function(req, res){
  const loggedIn = req.isAuthenticated();
  res.render("user",{loggedIn});
});

app.get("/home", function(req, res){
  const loggedIn = req.isAuthenticated();
  if(loggedIn){
    Post.find({}, function(err, posts){
      if(!err){
        res.render("home",{username:req.user.username,type:"All",array:posts,loggedIn:loggedIn});
      }
    });
  }else{
    res.redirect("/login");
  }

});

app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/user");
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/login");
      });
    }
  });

});

app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/pass' }),
  function(req, res) {
    res.redirect('/home');
  });

app.post("/user",function(req,res){
  res.redirect("/register");
});
app.post("/pass",function(req,res){
  res.redirect("/login");
});




//main app

app.get("/posts",function(req,res){
  const loggedIn = req.isAuthenticated();
  Post.find({postedbyid:req.user._id}, function(err, posts){
    if(!err){
      res.render("posts",{array:posts,loggedIn:loggedIn});
    }
  });
});

app.get("/gstart",function(req,res){
  const loggedIn = req.isAuthenticated();
  res.render("gstart",{loggedIn:loggedIn});
});
app.get("/about",function(req,res){
  const loggedIn = req.isAuthenticated();
  res.render("about",{loggedIn:loggedIn});
});
app.get("/compose",function(req,res){
  const loggedIn = req.isAuthenticated();
  res.render("compose",{loggedIn:loggedIn})
  // console.log(req.user.username);
});
// Composing new posts
app.post("/compose",function(req,res){
  const post=new Post({
    title:req.body.postTitle,
    post:req.body.postBody,
    postedby:req.user.username,
    postedbyid:req.user._id
  });
  // let text=req.body.postBody;
  // console.log(post);
  post.save(function(err){
    if (!err){
      res.redirect("/home");
    }
  });
  });

app.get("/posts/:pos", function(req,res){
  const loggedIn = req.isAuthenticated();
  const ur =req.params.pos;//prining the post from url
  // console.log(ur);
  Post.findOne({_id:ur}, function(err, post){
    if (err) console.log(err);
    if(!err){
      res.render("post",{array2:post,loggedIn:loggedIn});
      return;
    }
  });
});
// Deleting posts
app.post("/delete",function(req,res){
  const delpost=req.body.perm;
  // console.log(delpost);
  Post.findOneAndDelete({postedbyid:req.user._id,_id:delpost}, function(err,delist){
    if(!err){
      // console.log("Post Deleted");
      res.redirect("/home");
    }
  });
});
// Writing comments
app.post("/comment",function(req,res){
  const comment=req.body.comment;
  const commentby=req.user.username;
  const postid=req.body.pid;
  const repl={
      comment:comment,
      commentby:commentby
  }
  // console.log(comment);
  Post.findOne({_id:postid}, function(err,repli){
      if(!err){
        repli.comments.push(repl);
        repli.save();
        // console.log("Comment added");
        res.redirect("/posts/"+postid);
      }
    });
  });

// Searching post
app.post("/search",async function(req,res){
  // const str=req.body.searchString;
  const loggedIn = req.isAuthenticated();
  if(loggedIn){
    const str=req.body.searchString?{
      $or:[
        {title:{$regex:req.body.searchString, $options:"i"}},
        {post:{$regex:req.body.searchString, $options:"i"}}
      ]
    }:{};
    const result=await Post.find(str);
    res.render("home",{username:req.user.username,type:"Searched",array:result,loggedIn:loggedIn});
  }
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}


app.listen(port, function() {
  console.log("Server has started on port 4000.");
});