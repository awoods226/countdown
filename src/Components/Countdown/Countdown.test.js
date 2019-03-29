import dateFns from "date-fns";
import {
  parseTimeString,
  getTimeRemaining,
  isEventOngoing,
  parseDuration
} from "../../timer";

it("can parseTime string", () => {
  const expiresAt = "2018-08-05T03:30d60,2018-08-05T09:30d30";
  const startTime = dateFns.parse("2018-08-04T07:30");
  var timeLeft = parseTimeString(expiresAt, startTime);
  expect(timeLeft).toBeTruthy();
  var firstDay = timeLeft[0];
  expect(firstDay.dateTime).toEqual(dateFns.parse("2018-08-05T03:30:00"));
  var secondDay = timeLeft[1];
  expect(secondDay.dateTime).toEqual(dateFns.parse("2018-08-05T09:30:00"));
});

it("can caluclate endTime", () => {
  const expiresAt = "2018-08-05T03:30d60,2018-08-05T09:30d30";
  const startTime = dateFns.parse("2018-08-04T07:30");
  var timeLeft = parseTimeString(expiresAt, startTime);
  expect(timeLeft).toBeTruthy();
  var firstDay = timeLeft[0].endTime;
  expect(firstDay).toEqual(dateFns.parse("2018-08-05T04:30:00"));
  var secondDay = timeLeft[1].endTime;
  expect(secondDay).toEqual(dateFns.parse("2018-08-05T10:00:00"));
});

it("can handle event passed", () => {
  const expiresAt = "2018-08-05T03:30d60,2018-08-05T09:30d30";
  const startTime = dateFns.parse("2018-08-06T07:30");
  var timeLeft = parseTimeString(expiresAt, startTime);
  expect(timeLeft).toBeTruthy();
  var firstDay = timeLeft[0].endTime;
  expect(firstDay).toEqual(dateFns.parse("2018-08-12T04:30:00"));
  var secondDay = timeLeft[1].endTime;
  expect(secondDay).toEqual(dateFns.parse("2018-08-12T10:00:00"));
});

it("can calculate remaining time", () => {
  //endTimes: localTimes, targetTime: localTimes[this.state.eventIndex]
  const expiresAt = "2018-08-05T03:30d60,2018-08-05T09:30d30";
  var startTime = dateFns.parse("2018-08-04T07:30");
  var parsedTimes = parseTimeString(expiresAt, startTime);
  var timeRemaining = getTimeRemaining(startTime, parsedTimes, parsedTimes[0]);
  expect(timeRemaining).toBeTruthy();
  expect(timeRemaining.days).toEqual("00");
  expect(timeRemaining.hours).toEqual("20");
  expect(timeRemaining.minutes).toEqual("00");
  expect(timeRemaining.total).toEqual(72000000);

  timeRemaining = getTimeRemaining(startTime, parsedTimes, parsedTimes[1]);
  expect(timeRemaining).toBeTruthy();
  expect(timeRemaining.days).toEqual("01");
  expect(timeRemaining.hours).toEqual("02");
  expect(timeRemaining.minutes).toEqual("00");
  expect(timeRemaining.total).toEqual(93600000);

  startTime = dateFns.parse("2018-08-05T03:30");
  timeRemaining = getTimeRemaining(startTime, parsedTimes, parsedTimes[0]);
  expect(timeRemaining).toBeTruthy();
  expect(timeRemaining.days).toEqual("00");
  expect(timeRemaining.hours).toEqual("00");
  expect(timeRemaining.minutes).toEqual("00");
  expect(timeRemaining.total).toEqual(0);
});
// it("can parse duration hour", () => {
//   const durationString = "d1:00";
//   var duration = parseDuration(durationString);
//   expect(duration).toBeTruthy();
//   expect(duration).toEqual(60);
// });

it("can parse duration minutes", () => {
  const durationString = "d35";
  var duration = parseDuration(durationString);
  expect(duration).toBeTruthy();
  expect(duration).toEqual(35);
});

// it("can parse duration hour with minutes", () => {
//   const durationString = "d2:30";
//   var duration = parseDuration(durationString);
//   expect(duration).toBeTruthy();
//   expect(duration).toEqual(150);
// });

it("can calc ongoing event", () => {
  const startTime = dateFns.parse("2018-08-04T07:30");
  const endTime = dateFns.parse("2018-08-04T07:29");
  var isEventLive = isEventOngoing(startTime, endTime);
  expect(isEventLive).toBeFalsy();
});
