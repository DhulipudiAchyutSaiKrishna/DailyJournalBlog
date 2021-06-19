//Required modules are declared here
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
const mongoose = require("mongoose");

//contents of home.ejs, about.ejs and contact.ejs are assigned here
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

//loading the required modules into our app.js and using them
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//DB connectivity
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser : true, useUnifiedTopology : true});

//Schema for the Post
const blogPostSchema = new mongoose.Schema({
  composeTitle : String,
  postData : String
});

//Model that uses the above defined Schema
const Post = mongoose.model("Post", blogPostSchema);

//Setting up the view engine to display the contents using ejs templating
app.set('view engine', 'ejs');

//Root Route
app.get("/", (req, res)=>{
  Post.find({}, (err, posts)=>{
    res.render("home",{homeStartingContent : homeStartingContent , posts : posts});
  });
});

//About Route
app.get("/about", (req, res)=>{
  res.render("about", {aboutContent : aboutContent});
});

//Contact Route
app.get("/contact", (req, res)=>{
  res.render("contact", {contactContent : contactContent});
});

//Compose Route
app.get("/compose", (req, res)=>{
  res.render("compose");
});

//Post request for the compose Route
app.post("/compose", (req,res)=>{
  const post = new Post({                   //Creates a new post using Post Model
    composeTitle : req.body.composeTitle,
    postData : req.body.postData
  });

  post.save((err)=>{                       // Saves the new post inside DB
    if(!err){
      res.redirect("/");
    }else{
      console.log(err);
    }
  });

});

// Redirects to the actual post whenever Readmore link is clicked.
app.get("/posts/:postId", (req, res)=>{
  const requestedPostId = req.params.postId;
  Post.findOne({_id : requestedPostId}, (err, post)=>{
    res.render("post", {post : post});
  });
});

// Finally app is listening on port 3000
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
