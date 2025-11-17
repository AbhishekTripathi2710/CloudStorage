const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function requireAuth(req,res,next){
    try{
        const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
        if(!token) return res.status(401).json({error:"Unauthorized"});
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {user_id: decoded.user_id, email: decoded.email};
        next();
    }catch(err){
        console.error('Auth error',err);
        return res.status(401).json({error: 'Unauthorized'});
    }
}

module.exports = {requireAuth};