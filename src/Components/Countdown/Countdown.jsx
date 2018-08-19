import React, { Component } from "react";
import dateFns from "date-fns";
import PropTypes from "prop-types";

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endTimes: undefined,
      timeLeft: undefined,
      targetTime: undefined,
      isLiveNow: false,
      eventIndex: 0
    };
  }
  parseTimeString = expiresAt => {
    if (!expiresAt) {
      console.log("ERROR: Expiration seed date required");
      return;
    }
    var timeStringArray = expiresAt.split(",");

    var now = this.props.startDateTime;
    if (!now) {
      now = new Date();
    }
    var currentDay = dateFns.getDay(now);
    var localTimes = timeStringArray.map(f => {
      var newDate = now;

      //strip off duration
      let splitArray = f.split("d");
      let dateTime = splitArray[0];
      let duration = splitArray[1].replace("d", "");

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
      let eventDurationMinutes = parseInt(duration);
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
    this.setState(
      { endTimes: localTimes, targetTime: localTimes[this.state.eventIndex] },
      () => this.start()
    );
  };
  // Wait until the component has mounted to start the animation frame
  componentDidMount() {
    this.parseTimeString(this.props.expiresAt);
  }
  // Clean up by cancelling any animation frame previously scheduled
  componentWillUnmount() {
    this.stop();
  }
  start = () => {
    this.frameId = requestAnimationFrame(this.tick);
  };
  tick = () => {
    const timeLeft = this.getTimeRemaining();
    if (timeLeft.total <= 0) {
      this.stop();
    } else {
      this.setState(
        { timeLeft: timeLeft },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
    }
  };
  stop = () => {
    // cancelAnimationFrame(this.frameId);
    // is event currently live, if not set next target
    let now = this.props.startDateTime;
    if (!now) {
      now = new Date();
    }
    const { targetTime } = this.state;
    if (dateFns.isBefore(now, targetTime.endTime)) {
      this.setState(
        { isLiveNow: true },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
    } else {
      this.setState(
        {
          isLiveNow: false,
          targetTime: this.state.endTimes[this.state.eventIndex],
          eventIndex: this.state.eventIndex + 1
        },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
    }
  };
  minTwoDigits = n => {
    if (n < 0) {
      return n;
    }
    return (n < 10 ? "0" : "") + n;
  };
  getObjFromTime = dateTime => {
    return this.state.endTimes.filter(f => {
      return dateFns.isEqual(f.dateTime, dateTime);
    });
  };
  getTimeRemaining = () => {
    if (!this.state.endTimes) {
      return;
    }
    let now = this.props.startDateTime;
    if (!now) {
      now = new Date();
    }
    const { targetTime } = this.state;
    // remove any events that already happened today

    let difference_ms = dateFns.differenceInMilliseconds(
      targetTime.dateTime,
      now
    );
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    if (seconds === -0) {
      seconds = 0;
    }
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
    if (minutes === -0) {
      minutes = 0;
    }
    difference_ms = difference_ms / 60;
    var hours = Math.floor(difference_ms % 24);
    var days = Math.floor(difference_ms / 24);
    var remaining = {
      days: this.minTwoDigits(days),
      hours: this.minTwoDigits(hours),
      minutes: this.minTwoDigits(minutes),
      seconds: this.minTwoDigits(seconds),
      total: difference_ms
    };
    return remaining;
  };
  render() {
    return (
      <div>
        {this.state.timeLeft &&
          !this.state.isLiveNow && (
            <div className={"countdown-container"}>
              {this.props.displayTitle && <span>{this.props.title}</span>}
              <div className="col cd-days">
                <h3>{this.state.timeLeft.days}</h3>
                <span>days</span>
              </div>
              <div className="col cd-hours">
                <h3>{this.state.timeLeft.hours}</h3>
                <span>hours</span>
              </div>
              <div className="col cd-minutes">
                <h3>{this.state.timeLeft.minutes}</h3>
                <span>minutes</span>
              </div>
              {this.props.displaySeconds && (
                <div className="col cd-seconds">
                  <h3>{this.state.timeLeft.seconds}</h3>
                  <span>seconds</span>
                </div>
              )}
            </div>
          )}
        {this.state.isLiveNow && (
          <a>
            <span>LIVE NOW</span>
          </a>
        )}
      </div>
    );
  }
}

CountdownTimer.defaultProps = {};

CountdownTimer.propTypes = {
  expiresAt: PropTypes.string,
  title: PropTypes.string,
  displayTitle: PropTypes.bool,
  displaySeconds: PropTypes.bool,
  // used for unit testing
  startDateTime: PropTypes.instanceOf(Date)
};

export default CountdownTimer;
