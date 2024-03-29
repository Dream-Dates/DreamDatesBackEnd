const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { appendEvents, appendMovies, appendRestaurants, appendAttractions } = require("../utils/appendHelpers");
const eventController = require("../controllers/events.controller")


router.get("/events", eventController.getEvents);


router.get("/attractions", async (req, res) => {
    try {
        const attractions = await pool.query("SELECT * FROM attractions");

        res.json(formatAttractionsData(attractions));
    } catch (err) {
        console.error(err.message);
    }
});

const formatAttractionsData = (attractions) => {
    const result = attractions.rows.map((restaurant) => {
        let newImages = restaurant.image.replace(/{|}|"/g, "");
        let imageList = newImages.split(",");
        let newTime = restaurant.opening_hours.replace(/{|}|"/g, "");
        let timeList = newTime.split(",");
        const reviews = JSON.parse(restaurant?.reviews)
        return { ...restaurant, image: imageList, opening_hours: timeList, reviews };
    });

    return result;
}

router.get("/restaurants", async (req, res) => {
    try {
        const restaurants = await pool.query("SELECT * FROM restaurants");

        // let formattedRestaurants = 

        res.json(formatRestaurantData(restaurants));
    } catch (err) {
        console.error(err.message);
    }
});

const formatRestaurantData = (restaurants) => {
    const result = restaurants.rows.map((restaurant, index) => {
        let newImages = restaurant.image.replace(/{|}|"/g, "");
        let imageList = newImages.split(",");
        let newTime = restaurant.opening_hours.replace(/{|}|"/g, "");
        let timeList = newTime.split(",");
        const reviews = JSON.parse(restaurant?.reviews)
        return { ...restaurant, image: imageList, opening_hours: timeList, reviews };
    });

    return result;
}

// fetching movies
router.get("/movies", async (req, res) => {
    try {
        const movies = await pool.query("SELECT * FROM movies");
        res.json(movies.rows);
    } catch (err) {
        console.error(err.message);
    }
});


//fetching all date ideas
router.get("/dates", async (req, res) => {
    try {
        const movies = await pool.query("select * from movies");
        const events = await pool.query("select * from events");
        const nearbyplaces = await pool.query("select * from restaurants");
        res.json({
            movies: movies.rows,
            events: events.rows,
            nearbyplaces: nearbyplaces.rows,
        });
    } catch (err) {
        console.log(err.message);
    }
});

router.post("/saved/dates", async (req, res) => {
    // reviews reviews, trailer, datetime_utc
    try {
        const { user_id } = req.body;
        const events = await pool.query(
            "select * from dating_ideas where user_id = $1",
            [user_id]
        );
        let timeList;
        let imageList;
        let formattedEvents = events.rows.map((ele) => {
            if (ele.opening_hours) {
                let newTime = ele.opening_hours.replace(/{|}|"/g, "");
                timeList = newTime.split(",");
            }
            if (ele.image) {
                let newImages = ele.image.replace(/{|}|"/g, "");
                imageList = newImages.split(",");
            }
            return { ...ele, image: imageList, opening_hours: timeList };
        });


        res.json(formattedEvents);
    } catch (err) {
        console.error(err.message);
    }
});

// saving date idea
router.post("/datingideas/saved", async (req, res) => {
    try {
        const {
            id,
            type,
            title,
            address_street,
            city,
            country,
            venue,
            price_range,
            link,
            img,
            time,
            description,
            votes,
            price,
            opening_hours,
            website,
            rating,
            user_id,
            location,
            image,
            reviews,
            trailer,
            datetime_utc,
        } = req.body;
        console.log(id, address_street, rating, title);
        //events
        if (title && type && address_street && city && venue && country) {
            const eventSaved = await pool.query(
                "INSERT INTO dating_ideas (id, type, title, address_street, city, country, venue,price_range,link,img,time, user_id) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12)",
                [
                    id,
                    type,
                    title,
                    address_street,
                    city,
                    country,
                    venue,
                    price_range,
                    link,
                    img,
                    time,
                    user_id,
                ]
            );
            res.json(eventSaved);
        }
        //movies
        if (title && description && img && votes && price && link) {
            const moviesSaved = await pool.query(
                "INSERT INTO dating_ideas (id, title, description, img, votes, price_range, link, user_id) VALUES ($1, $2, $3, $4, $5,$6,$7,$8)",
                [id, title, description, img, votes, price_range, link, user_id]
            );
            res.json(moviesSaved);
        }
        //restaurant
        if (id && image && title && rating && address_street) {
            const restaurantSaved = await pool.query(
                "INSERT INTO dating_ideas (id, img, opening_hours,website,title,rating,price_range,address_street, user_id,image,reviews) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11)",
                [
                    id,
                    img,
                    opening_hours,
                    website,
                    title,
                    rating,
                    price_range,
                    address_street,
                    user_id,
                    image,
                    reviews
                ]
            );
            console.log("saving restaurants data")
            res.json(restaurantSaved);
        }

    } catch (err) {
        console.log(err.message);
    }
});

// New ideas endpoint 
router.post("/save/idea", async (req, res) => {
    try {
        const {
            id,
            type,
            user_id
        } = req.body;
        console.log(id, type, user_id);

        const eventSaved = await pool.query(
            "INSERT INTO ideas (id, type, user_id) VALUES ($1, $2, $3)",
            [
                id,
                type,
                user_id
            ]
        );
        res.json(eventSaved);

    } catch (err) {
        console.log(err.message);
    }
});


// get saved ideas 
router.post("/saved/ideas", async (req, res) => {
    // reviews reviews, trailer, datetime_utc
    try {
        const { user_id } = req.body;

        if (user_id) {

            const ideasData = await pool.query(
                "select * from ideas where user_id = $1",
                [user_id]
            );
            const ideas = ideasData?.rows
            // console.log('ides', ideas)

            const ideasResult = await Promise.all(ideas?.map(async idea => {
                if (idea.type === "restaurants") {
                    const restaurants = await pool.query("SELECT DISTINCT * FROM restaurants where id = $1", [idea.id]);

                    return formatRestaurantData(restaurants)[0] || 'error restaurant';
                }
                if (idea.type === "attractions") {
                    const attractions = await pool.query("SELECT * FROM attractions where id = $1", [idea.id]);

                    return formatAttractionsData(attractions)[0] || 'error movies';
                }
                if (idea.type === "events") {
                    const events = await pool.query("SELECT * FROM events where id = $1", [idea.id]);

                    return events?.rows[0] || 'error events';
                }
                if (idea.type === "movies") {
                    const movies = await pool.query("SELECT * FROM movies where id = $1", [idea.id]);

                    return movies?.rows[0] || 'error movies';
                }

            }))
            // console.log('ideasResult', ideasResult)

            return res.json(ideasResult?.filter(e => e));
        }
        res.json({ error: 'user_id is missing' });

    } catch (err) {
        console.error(err.message);
    }
});


router.delete("/datingideas/delete/:dateId", async (req, res) => {
    try {
        const { dateId } = req.params;
        const { userid } = req.body;
        console.log({ dateId, userid });
        const deleteDate = await pool.query(
            "DELETE from dating_ideas where id = $1 AND user_id = $2",
            [dateId, parseInt(userid)]
        );
        res.json(deleteDate);
    } catch (err) {
        console.log(err.message);
    }
});





// Utility ROUTES

//send api to database (restaurants)
router.get("/append/restaurants", async (req, res) => {
    const data = await appendRestaurants()
    res.json({ data });
});

// router.get("/append/attractions")
router.get("/append/attractions", async (req, res) => {
    const data = await appendAttractions()
    res.json({ data });
});

//sending api to database (movies)
router.get("/append/movies", async (req, res) => {
    const data = await appendMovies()
    res.json({ data });
});

// sending events api to database (events)
router.get("/append/events", async (req, res) => {
    const data = await appendEvents()
    res.json({ data });
});


// post for creating a new user
router.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);
        if (user.rows.length !== 0) {
            return res.status(401).send("user already exists");
        }

        const newUser = await pool.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) returning *",
            [email, password]
        );
        res.json(newUser.rows[0].id);
    } catch (err) {
        console.error(err.message);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE email = $1", [
            email,
        ]);

        if (user.rows.length === 0) {
            res.status(401).json("password or email is incorrect");
        }

        const id = user.rows[0].user_id;
        res.json({ id });
    } catch (err) { }
});


//delete for deleting a user
router.delete("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        pool.query("DELETE FROM dating_ideas WHERE id = $1", [id]);
        const deleteUser = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(deleteUser.rows);
    } catch (err) {
        console.log(err.message);
    }
});




module.exports = router;
