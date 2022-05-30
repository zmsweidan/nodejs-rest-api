

"use strict"

var cron = require('node-cron');

// Options
var SCHEDULE = '0 6 * * *' // 6:00 A.M ET
var options = {
    scheduled: true,
    timezone: "America/New_York"
};
SCHEDULE = '*/20 * * * * *'; options = {}; // every 20s

// Schedule Cron
cron.schedule(SCHEDULE, () => { 

    console.log(`Service ran at ${new Date()}`)

}, options);
