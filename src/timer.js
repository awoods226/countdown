import dateFns from "date-fns";

export function parseTimeString(expiresAt, startDateTime) {
  if (!expiresAt) {
    console.log("ERROR: Expiration seed date required");
    return;
  }
  var timeStringArray = expiresAt.split(",");

  var now = startDateTime;
  if (!now) {
    now = new Date();
  }
  var currentDay = dateFns.getDay(now);
  var localTimes = timeStringArray.map(f => {
    var newDate = now;

    //strip off duration
    let splitArray = f.split("d");
    let dateTime = splitArray[0];
    // let duration = splitArray[1].replace("d", "");
    // let durationArray = f.split(":");
    let duration = parseDuration(splitArray[1]);

    // parse string to a date object
    var date = dateFns.parse(dateTime);
    // strip off hours and minutes from desired date
    var hours = dateFns.getHours(date);
    var minutes = dateFns.getMinutes(date);

    // calculate desired day of week
    var targetDay = dateFns.getDay(date);
    var distance = (targetDay + 7 - currentDay) % 7;
    // set current date with desired day and time
    newDate = dateFns.setDate(newDate, newDate.getDate() + distance);
    newDate = dateFns.setHours(newDate, hours);
    newDate = dateFns.setMinutes(newDate, minutes);
    let eventDurationMinutes = duration;
    let startTime = dateFns.parse(newDate);
    let endTime = dateFns.addMinutes(startTime, eventDurationMinutes);

    // if distance is zero and event is over, set it to next week
    if (distance === 0 && dateFns.isBefore(endTime, now)) {
      newDate = dateFns.setDate(newDate, newDate.getDate() + 7);
    }

    return {
      dateTime: dateFns.parse(newDate),
      duration: eventDurationMinutes,
      endTime: endTime
    };
  });
  localTimes.sort((a, b) => {
    var distancea = Math.abs(now - a.dateTime);
    var distanceb = Math.abs(now - b.dateTime);
    return distancea - distanceb;
  });
  return localTimes;
}
export function getTimeRemaining(startTime, endTimes, targetTime) {
  if (!endTimes || !targetTime) {
    return;
  }
  let now = startTime;
  if (!now) {
    now = new Date();
  }

  let difference_ms = dateFns.differenceInMilliseconds(
    targetTime.dateTime,
    now
  );
  var diff_seconds = difference_ms / 1000;
  var seconds = Math.floor(diff_seconds % 60);
  if (seconds === -0) {
    seconds = 0;
  }
  var diff_mins = diff_seconds / 60;
  var minutes = Math.floor(diff_mins % 60);
  if (minutes === -0) {
    minutes = 0;
  }
  var diff_hours = diff_mins / 60;
  var hours = Math.floor(diff_hours % 24);
  var days = Math.floor(diff_hours / 24);

  var remaining = {
    days: minTwoDigits(days),
    hours: minTwoDigits(hours),
    minutes: minTwoDigits(minutes),
    seconds: minTwoDigits(seconds),
    total: difference_ms
  };
  return remaining;
}
export function isEventOngoing(startTime, endTime) {
  let now = startTime;
  if (!now) {
    now = new Date();
  }
  if (dateFns.isBefore(now, endTime)) {
    return true;
  }
  return false;
}
const minTwoDigits = n => {
  if (n < 0) {
    return n;
  }
  return (n < 10 ? "0" : "") + n;
};

export function parseDuration(durationString) {
  // strip d
  let duration = durationString.replace("d", "");
  // split hours and minutes
  // let durationArray = duration.split(":");
  // let totalMinutes = 0;
  // let hours = parseInt(durationArray[0]);
  // let minutes = parseInt(durationArray[1]);
  // if (hours > 0) {
  //   totalMinutes += hours * 60;
  // }
  // totalMinutes += minutes;
  return parseInt(duration);
}
