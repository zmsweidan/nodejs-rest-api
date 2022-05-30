"use strict"

var moment = require('moment');


/**
 * Gets the current UTC system date and time
 * @param {Number} days days prior(-) or after(+) the current date, default=0
 * @param {Boolean} upperLimit set to true to retrieve the upper time limit instead, default=false
 * @param {String} timeZone timezone string in time format e.g. '05:00' for ET
 */
function utcDate(days=0, upperLimit=false, timeZone) {
    let date = new Date(moment().utc(true))
    date.setDate(date.getDate() + days);
    date.setUTCMilliseconds(0);
    if (upperLimit) {
        if (timeZone) {
            let time = timeZone.split(':')
            date.setUTCHours(24 + Number(time[0]))
            date.setUTCMinutes(Number(time[1]))
            date.setUTCSeconds(0);
        } else {
            date.setUTCHours(23)
            date.setUTCMinutes(59);
            date.setUTCSeconds(59);
        }
    } else {
        if (timeZone) {
            let time = timeZone.split(':')
            date.setUTCHours(Number(time[0]))
            date.setUTCMinutes(Number(time[1]))
        } else {
            date.setUTCHours(0)
            date.setUTCMinutes(0);
        }
        date.setUTCSeconds(0);
    }
    return date;
}


/**
 * Formats a date object for readability
 * @param {Date} date 
 * @param {Boolean} local
 */
function timeStamp(date, local=true) {
    let formattedDate = moment.utc(date);
    if (local){
        formattedDate = formattedDate.local().format('YYYY-MM-DD h:mmA');
        return `${formattedDate} ET`;
    } else {
        formattedDate = formattedDate.format('YYYY-MM-DD h:mmA');
        return `${formattedDate} UTC`;
    }
}


/**
 * Gets a valid date string from a date object
 * @param {Date} date date
 * @param {Boolean} time include time with the date, default=false
 */
function getDateString(date, time=false) {
    let year = date.getUTCFullYear();
    let month = (date.getUTCMonth() + 1);
    let day = date.getUTCDate();
    let hours = date.getUTCHours();
    let minutes = date.getUTCMinutes();
    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}`: day;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}`: minutes;
    return time ? `${year}-${month}-${day}T${hours}:${minutes}Z` : `${year}-${month}-${day}`
}


/**
 * Calculates the number of days between 2 dates (a - b)
 * @param {Date} a date A
 * @param {Date} b date B
 */
function dateDayDifference(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc1 - utc2) / _MS_PER_DAY);
}


/**
 * Generates an array of date strings between 2 dates
 * @param {Date} low lower date limit
 * @param {Date} high upper date limit
 */
function dateArray(low, high) {
    let diff = dateDayDifference(high, low);
    let dates = [];
    for (let i=0; i < diff; i++) {
        let date = new Date(low.valueOf());
        date.setDate(date.getDate() + i);
        dates.push(getDateString(date))
    }
    return dates;
}


/**
 * Converts a map to an array
 * @param {*} mapObj map object
 */
function mapToArray(mapObj) {
    let arrObj = [];
    arrObj = Object.values(mapObj);
    return arrObj;
}

/**
 * Converts an array to a map
 * @param {[]} arrObj array object
 * @param {string} key select property key
 */
function arrayToMap(arrObj, key) {
    let mapObj = {};
    arrObj.map((value) => {
        mapObj[value[key]] = value;
    });
    return mapObj;
}

module.exports = {
    utcDate,
    timeStamp,
    getDateString,
    dateDayDifference,
    dateArray,
    mapToArray,
    arrayToMap
}