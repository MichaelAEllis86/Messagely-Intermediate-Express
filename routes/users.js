const express = require("express");
const User = require("../models/user");
const Message = require("../models/message");
const auth=require("../middleware/auth")
const ExpressError = require("../expressError");


const router = new express.Router();


//not sure what this is doing here? don't think we need anything from app here?
// const { router } = require("../app");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


router.get("/", auth.ensureLoggedIn, async function getAllUsers (req,res,next){
    try{
        const users=await User.all()
        return res.json({users:users})

    }
    catch(err){
        return next(err)
    }
})


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", auth.ensureLoggedIn, auth.ensureCorrectUser, async function getUser(req,res,next){
    try{
        const user=await User.get(req.params.username);
        return res.json({user:user})

    }
    catch(err){
        return next(err)

    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/to", auth.ensureLoggedIn, auth.ensureCorrectUser, async function getMessagesTo(req,res,next){
    try{
        const results=await User.messagesTo(req.params.username)
        formattedResults=results.map(r=>({id:r.id, body:r.body, sent_at:r.sent_at, read_at:r.read_at, from_user:{username:r.from_username, first_name:r.from_first_name, last_name:r.from_last_name, phone:r.from_phone}}))
        return res.json(formattedResults)

    }
    catch(err){
        return next(err)
    }
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from", auth.ensureLoggedIn, auth.ensureCorrectUser, async function getMessagesFrom(req,res,next){
    try{
        const results=await User.messagesFrom(req.params.username)
        formattedResults=results.map(r=>({id:r.id, body:r.body, sent_at:r.sent_at, read_at:r.read_at, to_user:{username:r.to_username, first_name:r.to_first_name, last_name:r.to_last_name, phone:r.to_phone}}) )
        return res.json(formattedResults)

    }
    catch(err){
        return next(err)
    }
})


module.exports=router;