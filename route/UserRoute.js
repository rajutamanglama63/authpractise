const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const User = require("../model/User");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/register", (req, res) => {
    const {name, email, password} = req.body;

    // simple validation
    if(!name || !email || !password) {
        return res.status(400).json({msg : "Please enter all field."});
    }

    // check for existing user
    User.findOne({email})
        .then(user => {
            if(user) return res.status(400).json({msg : "User already exist."});
        });

    // create new user
    const newUser = new User({
        name,
        email,
        password
    });

    // generate salt and hass
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
                .then(user => {
                    jwt.sign(
                        {id : user.id},
                        process.env.Jwt_secret,
                        {expiresIn : 3600},
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user : {
                                    id : user.id,
                                    name : user.name,
                                    email : user.email
                                }
                            });
                        }
                    )
                });
        });
    });

});


router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({msg : "Please enter all fields."})
    }

    try {
        const user = await User.findOne({email : email});
        if(!user) {
            return res.status(400).json({msg : "User does not exist."});
        }

        const isMatch = bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({msg : "Invalid credintials"});
        }

        const token = jwt.sign(
            {id : user.id},
            process.env.Jwt_secret,
            {expiresIn : 3600}
        )
        if(!token) {
            return res.status(400).json({msg : "Unable to sign token."});
        }

        res.status(200).json({
            token : token,
            user : {
                id : user.id,
                name : user.name,
                email : user.email
            }
        })
    } catch (err) {
        res.status(400).json({msg : err.message});
    }
})

// private user of verified token
router.get("/privateuser", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user) {
            return res.status(400).json({msg : "User does not exist."});
        }
        
        res.json(user);
    } catch (err) {
        res.status(400).json({msg : err.message});
    }
})

module.exports = router;