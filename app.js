const express=require('express');
const app=express();
require("dotenv").config();
const jwt=require('jsonwebtoken');

app.use(express.json());

app.post("/login",(req,res)=>{ 
    const {username,password}= req.body; 
    if (username==="admin" && password==="admin") { 
        const token= jwt.sign({username}, process.env.JWT_SECRET_KEY, {expiresIn: 80000}); 
        return res.json({username, token, msg: "Login Success"}); 
    } 
    return res.json({msg: "Invalid Credentials"}); 
});

const verifyTokenMiddleware= (req,res,next)=>{ 
    const {token} = req.body; 
    if (!token) {
        return res.status(403).json({msg: "No token present"});
    } 
    try { 
        const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY); 
        req.user= decoded; 
    } catch (err) { 
        return res.status(401).json({msg: "Invalid Token"}); 
    } 
    next(); 
}; 

app.get("/home",verifyTokenMiddleware,(req,res)=>{
    const{user}= req;
    res.json({msg: `welcome ${user.username}`});
});

app.listen(3000);