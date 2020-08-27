const express=require("express")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const ejs=require("ejs")
const app=express()

app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true,useUnifiedTopology: true})

const articleSchema={
    title:String,
    content:String
}

const Article=mongoose.model("Article",articleSchema)

app.route("/articles")
.get(function(req, res){
    Article.find(function(err, foundArticle){
        if (!err){
            res.send(foundArticle)
        }
        else{
            res.send(err)
        }
    })
})
.post(function(req,res){
    console.log(req.body.title)
    console.log(req.body.content)
    const article=new Article({
        title:req.body.title,
        content:req.body.content
    })
    article.save(function(err){
        if (!err){
            res.send("successfully sent to the db!")
        }
        else{
            res.send(err)
        }
    })
})
.delete(function(req,res){

    Article.deleteMany(function(err){
        if(!err){
            res.send("Successfully deleted all the docs")
        }
        else{
            res.send(err)
        }
    })
});

///Section to find specific article/////
app.route("/articles/:articleName")
.get(function(req,res){
    Article.findOne({title:req.params.articleName}, function(err, foundArticle){
        if (!err){
            res.send(foundArticle)
        }
        else{
            res.send("No Article Found!")
        }
    })
})
.put(function(req,res){
    Article.update(
        {title:req.params.articleName},
         {title:req.body.title, content:req.body.content},
         {overwrite:true},
         function(err){
             if (!err){
                 res.send("Updates successfully" )
             }
         })
})
.patch(function(req,res){
    Article.update(
        {title:req.params.articleName},
        {$set:req.body},function(err){
            if(!err){
                res.send("Successfully Updated!!!")
            }
        })
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleName},
        function(err){
            if(!err){
                res.send("Successfully Deleted:)))))")
            }
            else{
                res.send("There was problem deleting the File!!")
            }
        })
})

app.listen(4000, function(){
    console.log("server started on port 4000")
})
