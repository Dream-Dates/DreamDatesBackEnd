const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const fetch = require('node-fetch');
//middleware
app.use(cors())
app.use(express.json())


//Routes

app.get("/dreamdates/events", async (req,res) => {
try {
    fetch("https://api.seatgeek.com/2/events?venue.state=NY&client_id=MjgyNTU3MjV8MTY1OTYzNDg3Ni40NDU2MzI1")
    .then(res => res.json())
    .then(data => {
        // let inform = data.events
        // let title = inform.forEach(e => console.log(e.short_title))
        // let form = inform.forEach(e => console.log(e.type))
        res.json(data)
    })
} catch(err){
    console.error(err.message)
}
})

app.get("/dreamdates/movies", async (req,res) => {
    try {
        fetch("https://api.themoviedb.org/3/discover/movie?api_key=3c8d31b949ad58738c6e56fd0522a70a&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate")
        .then(res => res.json())
        .then(data => {
            res.json(data)
        })
    } catch(err){
        console.error(err.message)
    }
    })

// post for creating a new user
app.post("/dreamdates/new-user", async (req,res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body
        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2)",[email, password])
            res.json()
    } catch(err){
        console.error(err.message)
    }
    })

//post for saving the date idea towards the saved page
app.post("./dreamdates/saved-date", async (req,res) => {
try{
    console.log(req.body)
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

app.delete("./dreamdates/idea/:id", async (req,res) => {
    try{
        console.log(req.body)
    } catch(err){
        console.log(err.message)
    }
})

app.listen(4000, () => {
    console.log("the server is working")
})