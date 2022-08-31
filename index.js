const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const fetch = require("node-fetch");
const AuthRouter = require("./auth");
const verifyjwt = require("./authorization");
require("dotenv").config();

//middleware
app.use(cors());
app.use(express.json());
app.use(AuthRouter);
//Routes
//fetching events
app.get("/", (req, res) => {
  res.status(200).json("hello");
});
app.get("/dreamdates/events", async (req, res) => {
  try {
    const events = await pool.query("SELECT * FROM events");
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.post("/dreamdates/saved/dates", async (req, res) => {
  try {
    const { user_id } = req.body;
    const events = await pool.query(
      "select * from dating_ideas where user_id = $1",
      [user_id]
    );
    res.json(events.rows);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/dreamdates/attractions", async (req, res) => {
  try {
    const attractions = await pool.query("SELECT * FROM attractions");
    let formattedRestaurants = attractions.rows.map((restaurant) => {
      let newImages = restaurant.image.replace(/{|}|"/g, "");
      let imageList = newImages.split(",");
      let newTime = restaurant.opening_hours.replace(/{|}|"/g, "");
      let timeList = newTime.split(",");
      return { ...restaurant, image: imageList, opening_hours: timeList };
    });
    res.json(formattedRestaurants);
  } catch (err) {
    console.error(err.message);
  }
});
app.get("/dreamdates/restaurants", async (req, res) => {
  try {
    const restaurants = await pool.query("SELECT * FROM restaurants");

    let formattedRestaurants = restaurants.rows.map((restaurant) => {
      let newImages = restaurant.image.replace(/{|}|"/g, "");
      let imageList = newImages.split(",");
      let newTime = restaurant.opening_hours.replace(/{|}|"/g, "");
      let timeList = newTime.split(",");
      return { ...restaurant, image: imageList, opening_hours: timeList };
    });

    res.json(formattedRestaurants);
  } catch (err) {
    console.error(err.message);
  }
});
// fetching movies
app.get("/dreamdates/movies", async (req, res) => {
  try {
    const movies = await pool.query("SELECT * FROM movies");
    res.json(movies.rows);
  } catch (err) {
    console.error(err.message);
  }
});
// // fetching restaurants
// app.get("/dreamdates/restaurants", async (req,res) => {
//     try {
//     const restaurants = await pool.query("SELECT * FROM restaurants")
//     res.json(restaurants.rows)
//     } catch(err){
//         console.error(err.message)
//     }
// })
//fetching all date ideas
app.get("/dreamdates/dates", async (req, res) => {
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
//https://developers.google.com/maps/documentation/places/web-service/details
//send api to database (restaurants)
app.get("/dreamdates/append/restaurants", async (req, res) => {
  try {
    fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.726095,-79.442610&type=restaurant&radius=5000&key=${process.env.GOOGLE_API}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.results.map((e) => {
          let website = "";
          let img = "";
          let opening = [];
          let name = e.name;
          let rating = e.rating;
          let price = e.price_level;
          let location = e.vicinity;
          let id = e.place_id;
          //fetching more pics
          fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?fields=photos,opening_hours,website&place_id=${id}&key=${process.env.GOOGLE_API}`
          )
            .then((res) => res.json())
            .then((data) => {
              let groupImg = [];
              console.log(opening);
              if (data.result.website) {
                website = data.result.website;
              }
              if (data.result.opening_hours) {
                opening.push(data.result.opening_hours.weekday_text);
              }
              if (data.result.photos) {
                data.result.photos.map((e) => {
                  let photoRef = e.photo_reference;
                  img = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photo_reference=${photoRef}&key=AIzaSyB1WCqgoNdydHPMGHBjE7fR6lRhXuz27Xo`;
                  groupImg.push(img);
                });
                pool.query(
                  "INSERT INTO restaurants (id, image, opening_hours,website,title,rating,price_range,adress_street) VALUES ($1, $2, $3, $4,$5,$6,$7,$8)",
                  [
                    id,
                    groupImg,
                    opening,
                    website,
                    name,
                    rating,
                    price,
                    location,
                  ]
                );
                groupImg = [];
                opening = [];
                website = "";
              }
            });
        });
        res.json();
      });
  } catch (err) {
    console.log(err.message);
  }
});

// app.get("/dreamdates/append/attractions")
app.get("/dreamdates/append/attractions", async (req, res) => {
  try {
    fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.726095,-79.442610&type=tourist_attraction&radius=90000&key=${process.env.GOOGLE_API}`
    )
      .then((res) => res.json())
      .then((data) => {
        data.results.map((e) => {
          let website = "";
          let img = "";
          let opening = [];
          let price = "Free";
          let name = e.name;
          let rating = e.rating;
          let location = e.vicinity;
          let id = e.place_id;
          //fetching more pics
          fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?fields=photos,opening_hours,website&place_id=${id}&key=${process.env.GOOGLE_API}`
          )
            .then((res) => res.json())
            .then((data) => {
              let groupImg = [];
              if (data.result.website) {
                website = data.result.website;
              }
              if (data.result.opening_hours) {
                opening.push(data.result.opening_hours.weekday_text);
              }
              if (data.result.photos) {
                data.result.photos.map((e) => {
                  let photoRef = e.photo_reference;
                  img = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&maxheight=400&photo_reference=${photoRef}&key=AIzaSyB1WCqgoNdydHPMGHBjE7fR6lRhXuz27Xo`;
                  groupImg.push(img);
                });
                console.log(
                  id,
                  groupImg,
                  opening,
                  website,
                  name,
                  rating,
                  location
                );
                pool.query(
                  "INSERT INTO attractions (id, image, opening_hours,website,title,rating,price_range,adress_street) VALUES ($1, $2, $3, $4,$5,$6,$7,$8)",
                  [
                    id,
                    groupImg,
                    opening,
                    website,
                    name,
                    rating,
                    price,
                    location,
                  ]
                );
                groupImg = [];
                opening = [];
                website = "";
              }
            });
        });
        res.json();
      });
  } catch (err) {
    console.log(err.message);
  }
});
//sending api to database (movies)
app.get("/dreamdates/append/movies", async (req, res) => {
  try {
    fetch(
      "https://api.themoviedb.org/3/discover/movie?api_key=3c8d31b949ad58738c6e56fd0522a70a&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate"
    )
      .then((res) => res.json())
      .then((data) => {
        data.results.map((e) => {
          const id = e.id;
          const title = e.title;
          const description = e.overview;
          const img = `https://image.tmdb.org/t/p/w500` + `${e.poster_path}`;
          const vote = Math.floor(e.vote_average);
          const price = "$";

          getVideo(id, title, img, description, vote, price);
        });
        res.json();
      });
  } catch (err) {
    console.error(err.message);
  }
});
async function getVideo(id, title, img, description, vote, price) {
  fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=3c8d31b949ad58738c6e56fd0522a70a&language=en-US`
  )
    .then((res) => res.json())
    .then((data) => {
      let video = data.homepage;
      if (description && video) {
        sendMovieData(id, title, img, description, vote, price, video);
      }
    });
}

async function sendMovieData(id, title, img, description, vote, price, video) {
  pool.query(
    "INSERT INTO movies (id, title, description, img, votes, price, link) VALUES ($1, $2, $3, $4, $5,$6,$7)",
    [id, title, description, img, vote, price, video]
  );
}

// sending events api to database (events)
app.get("/dreamdates/append/events", async (req, res) => {
  try {
    fetch(
      "https://api.seatgeek.com/2/events?venue.city=TORONTO&datetime_utc.gt=2020-08-23&client_id=MjgyNTU3MjV8MTY1OTYzNDg3Ni40NDU2MzI1"
    )
      .then((res) => res.json())
      .then((data) => {
        data.events.map((e) => {
          let type = e.type;
          let title = e.title;
          let id = e.id;
          let addressStreet = e.venue.address;
          let city = e.venue.extended_address;
          let venue = e.venue.name;
          let country = e.venue.country;
          let price = "";
          let link = e.venue.url;
          let img = e.performers[0].images.huge;
          let time = e.visible_until_utc;
          sendEventsData(
            id,
            type,
            title,
            addressStreet,
            city,
            country,
            venue,
            price,
            link,
            img,
            time
          );
          //https://image.tmdb.org/t/p/w500/
        });

        res.json();
      });
  } catch (err) {
    console.error(err.message);
  }
});

async function sendEventsData(
  id,
  type,
  title,
  addressStreet,
  city,
  country,
  venue,
  price,
  link,
  img,
  time
) {
  if (img) {
    pool.query(
      "INSERT INTO events (id, type, title, adress_Street, city, country, venue,price_range,link,img,time) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11)",
      [
        id,
        type,
        title,
        addressStreet,
        city,
        country,
        venue,
        price,
        link,
        img,
        time,
      ]
    );
  } else {
    let image =
      "https://trello.com/1/cards/62e1986b704d656ec25f168c/attachments/62fff894fe86717729859552/download/events_backdrop.jpg";
    pool.query(
      "INSERT INTO events (id, type, title, adress_Street, city, country, venue,price_range,link,img,time) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11)",
      [
        id,
        type,
        title,
        addressStreet,
        city,
        country,
        venue,
        price,
        link,
        image,
        time,
      ]
    );
  }
}

// post for creating a new user
app.post("/dreamdates/register", async (req, res) => {
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

app.post("/dreamdates/login", async (req, res) => {
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
  } catch (err) {}
});
//delete for deleting a user
app.delete("/dreamdates/user/:id", async (req, res) => {
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

// saving date idea
app.post("/dreamdates/datingideas/saved", async (req, res) => {
  try {
    const {
      id,
      type,
      title,
      adress_street,
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
      image
    } = req.body;
    console.log(id, image, website, title, rating, price_range, adress_street);
    //events
    if (title && type && adress_street && city && venue && country) {
      const eventSaved = await pool.query(
        "INSERT INTO dating_ideas (id, type, title, adress_street, city, country, venue,price_range,link,img,time, user_id) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10,$11,$12)",
        [
          id,
          type,
          title,
          adress_street,
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
    if (
      id &&
      image &&
      website &&
      title &&
      rating &&
      price_range &&
      adress_street
    ) {
      const restaurantSaved = await pool.query(
        "INSERT INTO dating_ideas (id, img, opening_hours,website,title,rating,price_range,adress_street, user_id) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9)",
        [
          id,
          image,
          opening_hours,
          website,
          title,
          rating,
          price_range,
          adress_street,
          user_id,
        ]
      );
      res.json(restaurantSaved);
    }
    if (id && location && rating && title) {
      const attractionSaved = await pool.query(
        "INSERT INTO dating_ideas (id,title,adress_street,price_range,rating,opening_hours,website,image) VALUES ($1,$2,$3,$4,$5,$6,$7,$8",
        [
          id,
          title,
          adress_street,
          price_range,
          rating,
          opening_hours,
          website,
          img,
        ]
      );
      res.json(attractionSaved);
    }
  } catch (err) {
    console.log(err.message);
  }
});

app.delete("/dreamdates/datingideas/delete/:dateId", async (req, res) => {
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

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("the server is working");
});
