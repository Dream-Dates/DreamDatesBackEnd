const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const fetch = require('node-fetch');
const {Client} = require("@googlemaps/google-maps-services-js")
const jwt = require('jsonwebtoken')

const client = new Client({});

client
  .placesNearby({
    params: {
        locations: { lat: 43.67017, lng: -79.478432 },
        key: "AIzaSyB1WCqgoNdydHPMGHBjE7fR6lRhXuz27Xo",
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    r.data.results[0].json();
  }).then(data => {
    console.log(data)
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(cors())
app.use(express.json())
//AIzaSyB1WCqgoNdydHPMGHBjE7fR6lRhXuz27Xo
let config = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522%2C151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyB1WCqgoNdydHPMGHBjE7fR6lRhXuz27Xo'
  
   fetch(config)
  .then(response => {
    response.json();
  }).then(data => {
    console.log(data)
  })
  .catch(function (error) {
    console.log(error);
  });
  
//Routes
//fetching events
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
sendMovieData(id,title,img,description,vote)
        }) 
    res.json()
    })
    }catch(err){
        console.error(err.message)
    }
    })
//function sending movies api to database
    async function sendMovieData(id,title,img,description,vote){
pool.query(
        "INSERT INTO movies (id, title, description, img, votes) VALUES ($1, $2, $3, $4, $5)",[id,title,description,img,vote])
    }

// sending events api to database
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
                    sendEventsData(id,type,title,addressStreet,city,country,venue)
                //https://image.tmdb.org/t/p/w500/
            }) 
        res.json()
        })
        }catch(err){
            console.error(err.message)
        }
        })
//sending api to database
async function sendEventsData(id,type,title,addressStreet,city,country,venue){
    pool.query(
        "INSERT INTO events (id, type, title, adress_Street, city, country, venue) VALUES ($1, $2, $3, $4,$5,$6,$7)",[id,type,title,addressStreet,city,country,venue])
}

app.get("/dreamdates/dates", async (req,res) => {
    try{
const movies = await pool.query("select * from movies")
const events =await  pool.query("select * from events")
res.json({
    movies:movies.rows,
    events:events.rows
})
    } catch(err){
        console.log(err.message)
    }
})



// post for creating a new user
app.post("/dreamdates/register", async (req,res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body
        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",[email, password])
            res.json(newUser)
    } catch(err){
        console.error(err.message)
    }
    })

//post for saving the date idea towards the saved page
app.post("/dreamdates/saved-date", async (req,res) => {
try{
    const {id,title,description,img,userId } = req.body
    const saveDate = await pool.query(
        "INSERT INTO dating_ideas "
    )
} catch(err){
    console.log(err.message)
}
})
//delete for deleting a user
app.delete("./dreamdates/user/:id", async (req,res) => {
    try{
        console.log(req.body)
    } catch(err){
        console.log(err.message)
    }
})


app.listen(4000, () => {
    console.log("the server is working")
})