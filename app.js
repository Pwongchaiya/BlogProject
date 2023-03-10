const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

mongoose.set('strictQuery', true)
mongoose.connect("mongodb://127.0.0.1:27017/blog-post")

const app = express()

const postSchema = mongoose.Schema({
  title: String,
  post: String
})
const Post = mongoose.model("Post", postSchema)

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(express.static("partials"))

//-----------get-request-----------\\
app.get("/", function (req, res) { findAllPostAndRender(res, "home") })

app.get("/about", function (req, res) { res.render("about", { a: aboutContent }) })

app.get("/contact", function (req, res) { res.render("contact", { c:contactContent })})

app.get("/compose", function (req, res) { res.render("compose") })

app.get("/post/:postId", function (req, res) { getPostByIdAndRender(res, req.params.postId, "post") });

app.get("/blog-management", function (req, res) { findAllPostAndRender(res, "manage") })

app.get("/update/:postId",function (req, res) { getPostByIdAndRender(res, req.params.postId, "update") })

//-----------post-request-----------\\
app.post("/update/:postId", function (req,res) { updatePostById(res, req.params.postId, req.body.post) })

app.post("/compose", function (req, res) { savePost(res, req.body.title, req.body.post) })

app.post("/delete", function (req, res) { findPostByIdAndDelete(res, req.body.checkbox) })

//-----------port-listen-----------\\
app.listen(3000, function() { console.log("Server started on port 3000"); });


//---------------fuctions---------------\\
function findAllPostAndRender(res, view){
  Post.find({}, function (err, foundItem) { 
    if(err){
      console.log(err)
    }else{
      res.render(view, {
        homePageIntro: homeStartingContent,
        titleAndPost: foundItem
      });
    }
   })
}

function deletePost(post){
  Post.findByIdAndDelete(post, function (err) { 
    if(err){
      console.log(err)
    }else{
      console.log(post + " has been successfully deleted.")
    }
   })
}

function findPostByIdAndDelete(res, ids){
  if(Array.isArray(ids)){
    ids.forEach(id => {deletePost(id)})
  }else if(ids !== undefined){
    deletePost(ids)
  }
  res.redirect("/blog-management")
}

function getPostByIdAndRender(res, id, view){
  Post.findById(id, function (err, foundItem) { 
    if(!foundItem){
      res.redirect("/compose")
      console.log("No post was found with that name")
    }else{
      res.render(view,{
        postAndTitle: foundItem
      })
      console.log("Successfully retreived post: " + foundItem.title)
    }
   })
}

function updatePostById(res, id, currentPost){
  Post.findByIdAndUpdate(id, {post: currentPost}, function (err, foundItem) { 
    if(err){
      console.log(err)
    }else{
      console.log("post has successfully been updated to " + currentPost )
      res.redirect("/post/"+ id)
    }
   })
}

function savePost(res, workingTitle, workingPost){
  new Post({
    title: workingTitle,
    post: workingPost
  }).save();

  console.log("Succesfully created a post")
  res.redirect("/")
}