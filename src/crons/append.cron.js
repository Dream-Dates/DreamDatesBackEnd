var cron = require('node-cron');



// run every monday by 00:00
const appendMovies = cron.schedule('0 0 * * 1', () => {
    console.log('running appendMovies Cron Job');
    appendMovies();
}, {
    scheduled: false
});

// run every monday by 00:00
const appendEvents = cron.schedule('0 0 * * 1', () => {
    console.log('running appendEvents Cron Job');
    appendEvents();
}, {
    scheduled: false
});

// run every monday by 00:00
const appendRestaurants = cron.schedule('0 0 * * 1', () => {
    console.log('running appendRestaurants Cron Job');
    appendRestaurants();
}, {
    scheduled: false
});

// run every monday by 00:00
const appendAttractions = cron.schedule('0 0 * * 1', () => {
    console.log('running appendAttractions Cron Job');
    appendAttractions();
}, {
    scheduled: false
});

module.exports = {
    appendMovies,
    appendEvents,
    appendRestaurants,
    appendAttractions
};