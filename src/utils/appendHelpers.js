const pool = require("../config/db");


// sending events api to database (events)
const appendEvents = async () => {
    try {
        const result = await fetch(
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

                return data;
            });

        return result;
    } catch (err) {
        console.error(err.message);
    }
}

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

//sending api to database (movies)
const appendMovies = async () => {
    try {
        const result = await fetch(
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

                    // get
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


                });
                return data.results;
            });

        return result;
    } catch (err) {
        console.error(err.message);
    }
}

async function sendMovieData(id, title, img, description, vote, price, video) {
    pool.query(
        "INSERT INTO movies (id, title, description, img, votes, price, link) VALUES ($1, $2, $3, $4, $5,$6,$7)",
        [id, title, description, img, vote, price, video]
    );
}

//https://developers.google.com/maps/documentation/places/web-service/details
//send api to database (restaurants)
const appendRestaurants = async () => {

    try {


        const result = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=43.726095,-79.442610&type=restaurant&radius=5000&key=${process.env.GOOGLE_API}`
        )
            .then((res) => res.json())
            .then(async (data) => {
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
                        .then(async (data) => {
                            let groupImg = [];
                            // console.log(opening);
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
                return await data.results;
            });
        console.log("done")

        return result;
    } catch (err) {
        console.log("error: ", err.message);
    }
}

const appendAttractions = async () => {
    try {
        const result = await fetch(
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
                                // console.log(
                                //     id,
                                //     groupImg,
                                //     opening,
                                //     website,
                                //     name,
                                //     rating,
                                //     location
                                // );
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
                return data
            });

        return result
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = {
    appendEvents,
    appendMovies,
    appendRestaurants,
    appendAttractions
}