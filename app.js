//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require('express-session');
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
const path=require("path");
const moment=require("moment-timezone");

const app = express();
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, "public")));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));


// Connect to MongoDB database
mongoose.connect("mongodb+srv://admin-harsh:"+process.env.MONGO_KEY+"@cluster0.pqd8uax.mongodb.net/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Successful connection
mongoose.connection.on('connected', () => {
  console.log('Successfully connected to the database');
});

// Connection error
mongoose.connection.on('error', (err) => {
  console.error('Failed to connect to the database:', err);
});

// Create a new MongoDBStore instance
const store = new MongoDBStore({
  uri: "mongodb+srv://admin-harsh:"+process.env.MONGO_KEY+"@cluster0.pqd8uax.mongodb.net/userDB",
  collection: "sessions", // Collection to store sessions
  expires: 1800000
});

// Catch MongoDB connection errors
store.on("error", function (error) {
  console.log("Session store error:", error);
});


app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie:{
    maxAge:1800000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

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

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}


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

app.get("/home", ensureAuthenticated, function(req, res){
  const loggedIn = req.isAuthenticated();
    Post.find({}, function(err, posts){
      if(!err){
        res.render("home",{username:req.user.username,type:"All",array:posts,loggedIn:loggedIn});
      }
    });
});

app.get("/logout", function(req, res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

app.post("/register", function(req, res){
  const loggedIn=req.isAuthenticated();
  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.render("register",{loggedIn:loggedIn,error:"Username already taken"});
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/login");
      });
    }
  });

});

app.post('/login', (req, res, next) => {
  const loggedIn=req.isAuthenticated();
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      // Authentication failed, render the login page
      return res.render('login',{loggedIn:loggedIn,error:"Wrong username or password"});
    }
    // Authentication successful, redirect to the home page
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect('/home');
    });
  })(req, res, next);
});




//main app

app.get("/posts",ensureAuthenticated,async function(req,res){
  try {
    const loggedIn = req.isAuthenticated();
    const posts = await Post.find({ postedbyid: req.user._id });
    // Convert the date to IST time zone
    const postsWithISTDate = posts.map(post => {
      const istDate = moment(post.date).tz('Asia/Kolkata').format();
      return { ...post.toObject(), istDate: istDate };
    });
    res.render("posts", { array: postsWithISTDate, loggedIn: loggedIn });
  } catch (err) {
    // Handle the error appropriately
    console.error(err);
  }
});

app.get("/about",function(req,res){
  const loggedIn = req.isAuthenticated();
  res.render("about",{loggedIn:loggedIn});
});
app.get("/compose",ensureAuthenticated,function(req,res){
  const loggedIn = req.isAuthenticated();
    res.render("compose",{loggedIn:loggedIn});
});
// Composing new posts
app.post("/compose",ensureAuthenticated,async function(req,res){
  const post=new Post({
    title:req.body.postTitle,
    post:req.body.postBody,
    postedby:req.user.username,
    postedbyid:req.user._id
  });
  // let text=req.body.postBody;
  // console.log(post);
  await post.save(function(err){
    if (!err){
      res.redirect("/home");
    }
  });
  });

  app.get("/posts/:pos", ensureAuthenticated, async function(req, res) {
    try {
      const loggedIn = req.isAuthenticated();
      const postId = req.params.pos; // retrieving the post ID from the URL
      const post = await Post.findOne({ _id: postId });
      if (post) {
        res.render("post", { array2: post, loggedIn: loggedIn });
      } else {
        res.render("error", { page_name: "Error 404",loggedIn:loggedIn });
      }
    } catch (err) {
      // Handle the error appropriately
      console.error(err);
    }
  });
  
// Deleting posts
app.post("/delete", ensureAuthenticated, async function(req, res) {
  try {
    const delpost = req.body.perm;
    await Post.findOneAndDelete({ postedbyid: req.user._id, _id: delpost });
    // Post deleted successfully
    res.redirect("/home");
  } catch (err) {
    // Handle the error appropriately
    console.error(err);
  }
});

// Writing comments
app.post("/comment",ensureAuthenticated,async function(req,res){
  try{
  const comment=req.body.comment;
  const commentby=req.user.username;
  const postid=req.body.pid;
  const repl={
      comment:comment,
      commentby:commentby
  }
  // console.log(comment);
  const post=await Post.findOne({_id:postid});
  if (post) {
    post.comments.push(repl);
    await post.save();
    // Comment added successfully
    res.redirect("/posts/" + postid);
  } else {
    // Post not found
    res.render("error", { page_name: "Error 404",loggedIn:loggedIn })
  }
  } catch (err) {
  // Handle the error appropriately
  console.error(err);
  }
  });

// Searching post
app.post("/search",ensureAuthenticated,async function(req,res){
  // const str=req.body.searchString;
  const loggedIn = req.isAuthenticated();
    const str=req.body.searchString?{
      $or:[
        {title:{$regex:req.body.searchString, $options:"i"}},
        {post:{$regex:req.body.searchString, $options:"i"}}
      ]
    }:{};
    const result=await Post.find(str);
    res.render("home",{username:req.user.username,type:"Searched",array:result,loggedIn:loggedIn});
});

app.use(function(req, res, next) {
  const loggedIn=req.isAuthenticated();
  res.render("error", { page_name: "Error 404",loggedIn:loggedIn });
});


let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
  PORT = 4000;
}


app.listen(PORT, function() {
  console.log(`Server has started on port ${PORT}.`);
});