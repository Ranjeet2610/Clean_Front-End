import React, { Component } from 'react'
export default class Utilities extends Component {

static formatDate(date){
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

if (month.length < 2) 
    month = '0' + month;
if (day.length < 2) 
    day = '0' + day;

return [day, month,year,].join('-');
}
static datetime(dateTime){
    var today = new Date(dateTime);
var day = today.getDate() + "";
var month = (today.getMonth() + 1) + "";
var year = today.getFullYear() + "";
var hour = today.getHours() + "";
var minutes = today.getMinutes() + "";
var seconds = today.getSeconds() + "";

day = Utilities.checkZero(day);
month = Utilities.checkZero(month);
year = Utilities.checkZero(year);
hour = Utilities.checkZero(hour);
minutes = Utilities.checkZero(minutes);
seconds = Utilities.checkZero(seconds);
return day + "/" + month + "/" + year + " " + hour + ":" + minutes + ":" + seconds;

}
static displayDateTime(dateTime){
    var today = new Date(dateTime);
var day = today.getDate() + "";
var month = (today.getMonth() + 1) + "";
var year = today.getFullYear() + "";
var hour = today.getHours() + "";
var minutes = today.getMinutes() + "";
var seconds = today.getSeconds() + "";

day = Utilities.checkZero(day);
month = Utilities.checkZero(month);
year = Utilities.checkZero(year);
hour = Utilities.checkZero(hour);
minutes = Utilities.checkZero(minutes);
seconds = Utilities.checkZero(seconds);
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
return day + " " + monthNames[today.getMonth()] + " " + year + " " +Utilities.tConvert(hour + ":" + minutes + ":" + seconds);

}
static checkZero(data){
    if(data.length == 1){
      data = "0" + data;
    }
    return data;
  }
  static tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  
}