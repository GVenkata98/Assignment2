const express = require("express");
const Post = require("../modules/post");
const router = express.Router();

router.get("/", async (req, res) => {
    console.log("helloww....");
    const posts = await Post.find({user: req.user});
    res.json ({
        status: "Success",
        posts
    })

})

router.post("/", async (req, res) => {
    console.log("helloww....  posts.");
    const posts = await Post.create({
        title : req.body.title,
        body : req.body.body,
        image : req.body.image ,
        user : req.user
    });
    res.json ({
        status: "Success",
        posts
    })

})

router.put("/:id" , async (req,res) =>{
    console.log(req.params.id)
    const post = await Post.findOne({_id:req.params.id})
    if(post == null){
        return res.status(400).json({message: "Given id doesnt have any post."})
    }
    else{
        if(post.title){
            await Post.findByIdAndUpdate({_id:req.params.id}, {title : req.body.title})
        }
        if(post.body){
            await Post.findByIdAndUpdate({_id:req.params.id}, {body : req.body.body})
        }
        if(post.image){
            await Post.findByIdAndUpdate({_id:req.params.id}, {image : req.body.image})
        }
        return res.status(200).json({status:"Success"})
    }
})

router.delete("/:id" , async (req, res) =>{
    const post = await Post.findOne({_id : req.params.id})
    if(post == null){
        return res.status(400).json({message: "Given id doesnt have any post."})
    }
    else{
        await Post.findByIdAndDelete(req.params.id)
        return res.status(200).json({status:"Successfully Deleted."})
    }
})

module.exports = router;