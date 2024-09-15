const express = require("express");
const { SECRET_KEY } = require("../config");
const User = require("../models/user");
const Message = require("../models/message");
const auth=require("../middleware/auth")
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const e = require("express");

const router = new express.Router();


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", auth.validateLoginReqBody, async (req,res,next)=>{
    try{
        console.log("inside the login route!!!")
        console.log("this is req.body", req.body)
        const {username, password }=req.body
        if (await User.authenticate(username,password)){
            let token=jwt.sign({username},SECRET_KEY)
            console.log(`this is the generated jwt for login of user ${username}----->`,token)
            await User.updateLoginTimestamp(username)
            return res.json({token})}
        else{
            throw new ExpressError("invalid username or password", 401)
        }
    }
    catch(err){
        return next(err)
    }
})



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register",auth.EnsureValidRegisterRequestBody, async (req,res,next) =>{
    try{
        console.log("inside the register route!!!")
        console.log("this is req.body", req.body)
        const {username, password, first_name, last_name, phone }=req.body
        const results=await User.register({username, password, first_name, last_name, phone })
        console.log("this the the result of the register route")
        return res.json(results)

    }
    catch(err){ 
        console.log("this is the error obj in the register route",err)
        if(err.code === "23505"){
            return next(new ExpressError("Username is taken. Please choose another username",400))
        }
        return next (err)
    }
})

module.exports=router;

