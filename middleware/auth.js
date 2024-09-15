/** Middleware for handling req authorization for routes. */

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../expressError")

function EnsureValidRegisterRequestBody(req,res,next){
    try{
      const {username, password, first_name, last_name, phone }=req.body
        if(!username || !password || !first_name || !last_name || !phone ){
            throw new ExpressError("Bad Request! Missing JSON data! Please include json for your company in the request body in the following format----> {'username':'testuser', 'password':'your_password', 'first_name':'first_name_here', 'last_name':'last_name_here', 'phone':'8675309' }!",400)
        }
        return next()
      }
        // very important call of next() here. If it isn't called we can't move onto the route handler or next middleware.
    catch(err){
        return next(err);
    }
}

function validateLoginReqBody(req,res,next){
  try{
    const {username,password}=req.body
    if(!username || !password){
      throw new ExpressError("Missing username or password! Please include json for your login credentials in the request body in the following format----> {'username':'testuser', 'password':'your_password'}!",400)
  }
  return next();
}
  catch(err){
    return next(err)
  }
}

function validateNewMessageReqBody(req,res,next){
  try{
    const {to_username, body}=req.body
    if(! to_username || !body){
      throw new ExpressError("Missing data for new message! please include json for your message in the request body in the following format----> {'to_username': 'testuser', 'body':'message goes here'}", 400)
    }
    return next();
  }
  catch(err){
    return next(err)
  }
}
/** Middleware: Authenticate user. */

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, SECRET_KEY);
    console.log("this is the JWT payload--->",payload)
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

/** Middleware: Requires user is authenticated. */

function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    return next({ status: 401, message: "Unauthorized" });
  } else {
    return next();
  }
}

/** Middleware: Requires correct username. seems like this middleware just checks if req.body user matches one given in route param! which then means only the logged in user can see the info about themselves */

function ensureCorrectUser(req, res, next) {
  try {
    if (req.user.username === req.params.username) {
      return next();
    } else {
      return next({ status: 401, message: "Unauthorized" });
    }
  } catch (err) {
    // errors would happen here if we made a request and req.user is undefined
    return next({ status: 401, message: "Unauthorized" });
  }
}
// end

module.exports = {
  authenticateJWT,
  ensureLoggedIn,
  ensureCorrectUser,
  EnsureValidRegisterRequestBody,
  validateLoginReqBody,
  validateNewMessageReqBody
};
