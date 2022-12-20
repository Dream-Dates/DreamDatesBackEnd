const pool = require("../config/db");

const getEvent = (async (req, res) => { })

const getEvents = (async (req, res) => {
    try {
        const events = await pool.query("SELECT * FROM events");
        res.json(events.rows);
    } catch (err) {
        console.error(err.message);
    }
})

const addEvent = ((req, res) => { })

const removeEvent = ((req, res) => { })

const removeEvents = ((req, res) => { })

module.exports = {
    getEvents
}