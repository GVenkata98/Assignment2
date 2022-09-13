const express = require("express");
const User = require("../modules/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const router = express.Router();
const secret = "ASSIGNMENT";


router.post("/register", body("email").isEmail(), body("name").isAlpha(), body("password"), 
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        // console.log(req.body);

        bcrypt.hash(password, 10, async function (err, hash) {
            if (err) {
                res.status(500).json({
                    status: "failed",
                    message: err.message
                })
            }
            // console.log("hi...")
            const user = await User.create({
                name,
                email,
                password: hash
            });
            res.json({
                status: "sucess",
                data : user
            })
        });
    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        });
    }
});

router.post("/login", body("email"), body("password"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const {email, password } = req.body;
            const data = await User.findOne({email});

            if(!data){
               return res.status(400).json({
                    status: "failed",
                    message : "User is not registerd"
                })
            }

            bcrypt.compare(password, data.password, function(err, result) {
                if (err) {
                    return res.status(500).json({
                        status: "failed",
                        message: err.message
                    })
                }

                if(result){
                    const token = jwt.sign({
                        data: data._id
                      }, secret);

                      res.json({
                        status:  "Sucess",
                        token
                    });
                }


            });

        } catch (e) {
            res.status(500).json({
                status: "failed",
                message: e.message
            });
        };
    });
module.exports = router;