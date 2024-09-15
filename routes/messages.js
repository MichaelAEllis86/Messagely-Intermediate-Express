const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const auth=require("../middleware/auth")
const ExpressError = require("../expressError");


const router = new express.Router();




/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


//need to check error handling for unauthorized user
router.get("/:id", auth.ensureLoggedIn, async function getMessage(req,res,next){
    try{
        const results=await Message.get(req.params.id)
        console.log(results)
        if(results.from_user.username === req.user.username || results.to_user.username === req.user.username){
            return res.json({message:results})
        }
        else{
            return next({ status: 401, message: "Unauthorized" })
        }
    }
    catch(err){
        return next(err)

    }

})


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post("/", auth.ensureLoggedIn, auth.validateNewMessageReqBody, async function sendMessage(req,res,next){
    try{
        const fromUser=req.user.username 
        const {to_username, body}=req.body
        const results=await Message.create({from_username:fromUser, to_username, body})
        return res.json({message:results})

    }
    catch(err){
        return next(err)
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post("/:id/read", auth.ensureLoggedIn, async function markAsRead (req,res,next){
    try{
        const queryToUser=await Message.get(req.params.id)
        console.log(queryToUser)
        if(queryToUser.to_user.username === req.user.username){
            const results=await Message.markRead(req.params.id)
            return res.json({message:results})
        }
        else{
            return next({ status: 401, message: "Unauthorized" })
        }  
        
        

    }
    catch(err){
        return next(err)
    }
})

module.exports=router;