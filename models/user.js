const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt")
const db = require("../db");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const ExpressError = require("../expressError");

/** User class for message.ly */

// CREATE TABLE users (
//   username text PRIMARY KEY,
//   password text NOT NULL,
//   first_name text NOT NULL,
//   last_name text NOT NULL,
//   phone text NOT NULL,
//   join_at timestamp without time zone NOT NULL,
//   last_login_at timestamp with time zone
// );

/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    const hashedPassword=await bcrypt.hash(password, BCRYPT_WORK_FACTOR)
    // in this query we set the timestamp via postgres current_timestamp value. Doing this for join_at collumn to begin with
    const results =await db.query(`INSERT INTO users (username, password, first_name, last_name, phone, join_at) 
      VALUES($1,$2,$3,$4,$5,current_timestamp ) 
      RETURNING username, password, first_name, last_name, phone, join_at, last_login_at `,[username,hashedPassword,first_name,last_name,phone])
      console.log("here is the results.rows[0] of our register query--->",results.rows[0])
      return(results.rows[0])
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    const checkUserQuery=await db.query(`SELECT username, password FROM users WHERE username = $1`, [username])
    console.log("this is results.rows for checkUserQuery ----->",checkUserQuery.rows)
    if(checkUserQuery.rows.length===0){
      throw new ExpressError("User not found", 404)
    }
    const user=checkUserQuery.rows[0]
    if(user){
      if (await bcrypt.compare(password,user.password)){
        return true
      }
      else{
        return false
      }
    }

   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
    const results=await db.query(` UPDATE users SET last_login_at= current_timestamp WHERE username= $1 RETURNING username, last_login_at `,[username])
    console.log("here is the results.rows[0] of the query for updateLoginTimestamp--->",results.rows[0])
    return results.rows[0]
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const results=await db.query(`SELECT username, first_name, last_name, phone FROM users ORDER BY username`)
    console.log("this is results.rows for all user query ----->",results.rows)
    return results.rows
   }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const results=await db.query(`SELECT username, first_name, last_name, phone, join_at, last_login_at FROM users WHERE username = $1`, [username])
    console.log("this is results.rows for GET user by username query ----->",results.rows)
    if(results.rows.length===0){
      throw new ExpressError("User not found", 404)
    }
    return results.rows[0]
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const checkForUser=await db.query(`SELECT username first_name, last_name, phone, join_at, last_login_at FROM users WHERE username=$1`, [username])
    if (checkForUser.rows.length===0){
      throw new ExpressError("User not found", 404)
    }
    const results=await db.query(`SELECT m.id,
   m.from_username,
   f.first_name AS from_first_name,
   f.last_name AS from_last_name,
   f.phone AS from_phone,
   m.to_username,
   t.first_name AS to_first_name,
   t.last_name AS to_last_name,
   t.phone AS to_phone,
   m.body,
   m.sent_at,
   m.read_at
FROM messages AS m
JOIN users AS f ON m.from_username = f.username
JOIN users AS t ON m.to_username = t.username WHERE f.username= $1`,[username])
      console.log(`this is results.rows for user messages query for ${username} ----->`,results.rows)
      return results.rows
   }


  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) {
    const checkForUser=await db.query(`SELECT username first_name, last_name, phone, join_at, last_login_at FROM users WHERE username=$1`, [username])
    if (checkForUser.rows.length===0){
      throw new ExpressError("User not found", 404)
    }
    const results=await db.query(`SELECT m.id,
      m.from_username,
      f.first_name AS from_first_name,
      f.last_name AS from_last_name,
      f.phone AS from_phone,
      m.to_username,
      t.first_name AS to_first_name,
      t.last_name AS to_last_name,
      t.phone AS to_phone,
      m.body,
      m.sent_at,
      m.read_at
   FROM messages AS m
   JOIN users AS f ON m.from_username = f.username
   JOIN users AS t ON m.to_username = t.username WHERE t.username= $1`,[username])
         console.log(`this is results.rows for user messages query for ${username} ----->`,results.rows)
         return results.rows
   }
}


module.exports = User;

