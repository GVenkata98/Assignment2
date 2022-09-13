const express = require("express");
const mongoose = require("mongoose");
const User = require("./modules/user");
const bodyparser = require("body-parser");
const loginRoutes = require("./routes/login");
const postRoutes = require("./routes/posts");
mongoose.connect("mongodb://localhost/assignment", ()=> console.log("Connected to mongoDb."));
var jwt = require('jsonwebtoken');
const secret = "ASSIGNMENT" ;
const port = 3000; 


const app = express();

// app.use(bodyparser.json())
app.use(express.json());

app.use("/posts", async (req, res, next) => {
    console.log(req.headers.authorization);
    console.log("hi,,,....");
    if(req.headers.authorization){
        const token = req.headers.authorization;
        // console.log(token);
        
        jwt.verify(token, secret , async function(err, decoded) {
            if (err) {
                console.log(err);
               return res.status(501).json({
                    status: "failed",
                    message: "Not Authenticated",
                    // message: err.message
                })
            }
            const user = await User.findOne({_id: decoded.data});
            req.user = user._id;
            next();
          });
    }else {
       return  res.status(500).json({
            status: "failed",
            message: "Invalid token"
        })
    }
});


app.use("/", loginRoutes);
app.use("/posts", postRoutes);

app.get("*", (req, res) => {
    // console.log()
    res.status(404).json({
        status: "Failed",
        message: "API NOT FOUND"
    })
})
app.listen(port, () => console.log("The server is running"));
