const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const fetch = require('node-fetch');
const AuthRouter = require('./auth')
const verifyjwt = require("./authorization")
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())
app.use(AuthRouter)
//Routes
//fetching events
app.get("/", (req,res) => {
    res.status(200).json("hello")
})
app.get("/dreamdates/events", async (req,res) => {
try {
const events = await pool.query("SELECT * FROM events")
res.json(events.rows)
} catch(err){
    console.error(err.message)
}
})
// fetching movies
app.get("/dreamdates/movies", async (req,res) => {
    try {
    const movies = await pool.query("SELECT * FROM movies")
    res.json(movies.rows)
    } catch(err){
        console.error(err.message)
    }
    })
// fetching restaurants
app.get("/dreamdates/restaurants", async (req,res) => {
    try {
    const restaurants = await pool.query("SELECT * FROM restaurants")
    res.json(restaurants.rows)
    } catch(err){
        console.error(err.message)
    }
})
//fetching all date ideas
app.get("/dreamdates/dates", async (req,res) => {
    try{
const movies = await pool.query("select * from movies")
const events =await  pool.query("select * from events")
const nearbyplaces = await pool.query("select * from restaurants")
res.json({
    movies:movies.rows,
    events:events.rows,
    nearbyplaces: nearbyplaces.rows
})
    } catch(err){
        console.log(err.message)
    }
})

    //send api to database (restaurants)
app.get("/dreamdates/append/restaurants", async (req,res) => {
    try {
        fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.759059,-73.980768&type=restaurant&radius=5000&key=${process.env.GOOGLE_API}`)
.then(res => res.json())
.then(data => {
    data.results.map(e => {
        let name = e.name   
        let rating = e.rating 
        let price = e.price_level
        let location = e.vicinity
        let id = e.place_id
sendNearByPlaces(name,rating,price,location,id)
    })
    res.json()
})
    } catch (err){
        console.log(err.message)
    }
})

async function sendNearByPlaces(name,rating,price,location,id) {
    pool.query(
        "INSERT INTO restaurants (title, rating, price_range, adress_street, id) VALUES ($1, $2, $3, $4, $5)",[name,rating,price,location,id])
}
//sending api to database (movies)
app.get("/dreamdates/append/movies", async (req,res) => {
    try{
        fetch("https://api.themoviedb.org/3/discover/movie?api_key=3c8d31b949ad58738c6e56fd0522a70a&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate")
        .then(res => res.json())
        .then(data => {
            data.results.map(e=>{
                const id = e.id
                const title = e.title
                const description = e.overview
                const img = `https://image.tmdb.org/t/p/w500`+`${e.poster_path}`
                const vote = Math.floor(e.vote_average)
                const price = "$$"
               
  getVideo(id,title,img,description,vote,price)
        }) 
    res.json()
    })
    }catch(err){
        console.error(err.message)
    }
    })
    async function getVideo(id,title,img,description,vote,price){
fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=3c8d31b949ad58738c6e56fd0522a70a&language=en-US`)
.then(res => res.json())
.then(data => {
    
let video = data.homepage
if(description && video){
    sendMovieData(id,title,img,description,vote,price,video)
}

})
    }

    async function sendMovieData(id,title,img,description,vote,price,video){
pool.query(
        "INSERT INTO movies (id, title, description, img, votes, price, link) VALUES ($1, $2, $3, $4, $5,$6,$7)",[id,title,description,img,vote,price,video])
    }

// sending events api to database (events)
app.get("/dreamdates/append/events", async (req,res) => {
    try{
        fetch("https://api.seatgeek.com/2/events?venue.state=NY&client_id=MjgyNTU3MjV8MTY1OTYzNDg3Ni40NDU2MzI1")
        .then(res => res.json())
        .then(data => {
            data.events.map(e=>{
                let type = e.type
                let title = e.title
                let id = e.id
                let addressStreet = e.venue.address
                let city = e.venue.extended_address
                let venue = e.venue.name
                let country = e.venue.country
                let price = "$$$"
                let link = e.venue.url
                let img = e.performers[0].images
                let time = e.visible_until_utc
                sendEventsData(id,type,title,addressStreet,city,country,venue)
            //https://image.tmdb.org/t/p/w500/
        }) 
    res.json()
    })
    }catch(err){
        console.error(err.message)
    }
    })

async function sendEventsData(id,type,title,addressStreet,city,country,venue){
    pool.query(
        "INSERT INTO events (id, type, title, adress_Street, city, country, venue) VALUES ($1, $2, $3, $4,$5,$6,$7)",[id,type,title,addressStreet,city,country,venue])
}

// post for creating a new user
app.post("/dreamdates/register", async (req,res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
          ]);
          if (user.rows.length !== 0) {
            return res.status(401).send("user already exists");
          }

        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) returning *",[email, password])
            res.json(newUser.rows[0].id)
    } catch(err){
        console.error(err.message)
    }
    })

app.post("/dreamdates/login", async (req,res) => {
    try{
        const { email } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
          email,
        ]);
    
        if (user.rows.length === 0) {
          res.status(401).json("password or email is incorrect");
        }
    
        const id = user.rows[0].user_id
        res.json({ id });
    } catch(err){

    }
})
//delete for deleting a user
app.delete("/dreamdates/user/:id", async (req,res) => {
    try{
        const {id} = req.params;
        pool.query("DELETE FROM dating_ideas WHERE id = $1", [id])
        const deleteUser = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id])
        res.json(deleteUser.rows)
    } catch(err){
        console.log(err.message)
    }
})  

// saving date idea
app.post("/dreamdates/datingideas/saved", async (req,res) => {
    try{
        const {id,title,description,img,user_id,type,adress_street,city,venue,country,price_range,votes,rating} = req.body
        console.log(id,title,description,img,user_id,type,adress_street,city,venue,country,price_range,votes,rating)
        //events
        if(title && type && adress_street && city && venue && country && price_range){
            const eventSaved = await pool.query("INSERT INTO dating_ideas (id,title, type, adress_street,city,venue, country, price_range, user_id) VALUES $1,$2,$3,$4,$5,$6,$7,$8,$9",[id,title, type, adress_street,city,venue, country, price_range, user_id])
            res.json(eventSaved)                
        }
        //movies
        if(title && description && img && votes){
            const moviesSaved = await pool.query("INSERT INTO dating_ideas (id,title, description,img,votes user_id) VALUES ($1, $2, $3, $4,$5,$6)",[id,title, description,img,votes, user_id])
            res.json(moviesSaved)           
        }
        //restaurant
        if(title && adress_street && price_range && rating){
            const restaurantSaved = await pool.query("INSERT INTO dating_ideas (id,title, adress_street,price_range, rating) values $1,$2,$3,$4,$5",[id,title, description,img, user_id])
            res.json(restaurantSaved)
        }
    }
    catch(err){
        console.log(err.message)
    }
} )


app.delete("/dreamdates/datingideas/delete/:id", async (req,res) => {
try{
        const dateId = req.params
        const userid = req.body
        const deleteDate = await pool.query("DELETE from dating_ideas where id = $1 AND user_id = $2",[dateId,userid])
        res.json(deleteDate)
    } catch(err){
        console.log(err.message)
    }
})
    

const port = process.env.PORT || 4000
app.listen(port, () => {
    console.log("the server is working")
})
