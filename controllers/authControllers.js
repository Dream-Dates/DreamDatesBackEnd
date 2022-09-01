const pool = require('../db')
const bcrypt = require('bcrypt')
const jwtGenerator = require('../tokenGenerator')
const jwt = require('jsonwebtoken')

class AuthController {
    static async fetchMovies(req,res) {
        try {
const events = await pool.query("SELECT * FROM events")
res.json(events.rows)
} catch(err){
    console.error(err.message)
}
    }
    static async registerUser(req, res) {
        const {email, password, name, lastname, retypePassword} = req.body
        console.log(email, password, name, lastname, retypePassword)
        try {
          console.log(password,retypePassword)
          if(password !== retypePassword){
            return res.status(401).json({errorMessage:"Passwords do not match"})
          }
            function validEmail(userEmail) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
              }        
              if(password.length < 7) return res.status(401).json({errorMessage:"Password needs to be 8 characters long"})
              if (req.path === "/register") {
                console.log(!email.length);
                if (![email, password].every(Boolean)) {
                  return res.status(401).json({errorMessage:"Missing Credentials"});
                } else if (!validEmail(email)) {
                  return res.status(401).json({errorMessage:"The email you have enter is invalid"});
                }
              } 
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]).then(res => res.rows)

            if (user.length !== 0) {
                return res.status(409).json({errorMessage:"An account with this email already exists."})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
//return all data in json from users
            const newUser = await pool.query('INSERT INTO users (email, password, name, last_name) VALUES ($1, $2,$3,$4) RETURNING *', [
                email, 
                hashedPassword,
                name,
        lastname
      ]).then(res => res.rows)

          const getUser = await pool.query('SELECT * FROM users WHERE email = $1', [email])
          
            const token = jwtGenerator(newUser[0].id)
            return res.status(200).json({ getUser:getUser.rows, token: token})

        } catch (error) {
            return res.status(500).json('User not added or token not created')
        }
    }

    static async loginUser (req, res) {
        const {email, password} = req.body
        console.log(req.body)
        console.log(email, password)
        try {
            function validEmail(userEmail) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
              }        
              if(password.length < 7) return res.status(401).json({errorMessage:"password bust be 8 characters long"})
              if (req.path === "/login") {
                console.log(!email.length);
                if (![email, password].every(Boolean)) {
                  return res.status(401).json({errorMessage:"Missing Credentials"});
                } else if (!validEmail(email)) {
                  return res.status(401).json({errorMessage:"The email is invalid."});
                }
              } 
            const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]).then(res => res.rows)

            if (user.length === 0) {
                return res.status(401).json({errorMessage:"Invalid email or password"})
            }

            const validPassword = await bcrypt.compare(password, user[0].password)

            if (!validPassword) {
                return res.status(401).json({errorMessage:"Invalid password"})
            }
            const getUser = await pool.query('SELECT * FROM users WHERE email = $1', [
              email
    ])

            const token = jwtGenerator(user[0].id)

            return res.status(200).json({ getUser:getUser.rows, token: token})

        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }

    static async isVerified (req, res) {
        try {
            
            return res.status(200).json(true)
        } catch (error) {
            console.log(error)
            return res.status(500).json('Server error')
        }
    }
}


module.exports = AuthController