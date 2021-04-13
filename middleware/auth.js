const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    // check for token
    if(!token) {
        return res.status(400).json({msg : "Unauthorized, access denied."})
    }

    try {
        // verify token
        const decode = jwt.verify(token, process.env.Jwt_secret);
        // add user from payload
        req.user = decode;
        next();
    } catch (err) {
        res.status(400).json({msg : "Token is not valid."})
    }
}

module.exports = auth;