//JAN 1st 1970 00:00:00:00
//The JavaScript date is based on a time value that is milliseconds since midnight January 1, 1970, UTC.

let moment = require('moment');

let date =  moment();

console.log(date.format('MMM Do, YYYY h:mm a'));