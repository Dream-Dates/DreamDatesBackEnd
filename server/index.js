const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")

//middleware
app.use(cors())
app.use(express.json())


//Routes

app.get("/dreamdates", async (req,res) => {
try {
    console.log(req.body)
} catch(err){
    console.error(err.message)
}
})

app.post("/dreamdates", async (req,res) => {
    try {
        console.log(req.body)
    } catch(err){
        console.error(err.message)
    }
    })


app.listen(4000, () => {
    console.log("the server is working")
})