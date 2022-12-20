const express = require("express");
const app = express();
const cors = require("cors");
const routes = require("./src/routes");
require("dotenv").config();
const jobs = require('./src/crons/')

//middleware
app.use(cors());
app.use(express.json());

// cron jobs
(() => {
  console.log('Starting cron jobs... 💼');

  Object.values(jobs).map((job) => job.start())
})()


//Routes
app.use(routes);


//fetching events
app.get("/", (req, res) => {
  res.status(200).json("hello");
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`The server is working at http://localhost:${port} ✅`);
});

