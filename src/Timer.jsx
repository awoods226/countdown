import React, { Component } from "react";
import dateFns from "date-fns";

Date.prototype.setDay = function (dayOfWeek) {
  this.setDate(this.getDate() - this.getDay() + dayOfWeek);
};

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endTimes: undefined,
      timeLeft: undefined
    };
    this.parseTimeString(props.expiresAt);
  }
  parseTimeString = expiresAt => {
    var timeStringArray = expiresAt.split(",");
    var now = new Date();
    var currentDay = dateFns.getDay(now);
    var localTimes = timeStringArray.map(f => {
      var newDate = new Date();

      // parse string to a date object
      var date = dateFns.parse(f);
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

      var f = dateFns.parse(newDate);
      return dateFns.parse(newDate);

    });
    this.setState({ endTimes: localTimes });
  };
  // Wait until the component has mounted to start the animation frame
  componentDidMount() {
    this.start();
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
      // ...any other actions to do on expiration
    } else {
      this.setState(
        { timeLeft: timeLeft },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
    }
  };
  stop = () => {
    cancelAnimationFrame(this.frameId);
  };
  minTwoDigits = n => {
    return (n < 10 ? "0" : "") + n;
  };
  getTimeRemaining = () => {
    if (!this.state.endTimes) {
      return;
    }
    let now = new Date();

    // get soonest day in endTimes array
    var endTarget = dateFns.closestTo(now, this.state.endTimes);

    let difference_ms = dateFns.differenceInMilliseconds(endTarget, now);
    difference_ms = difference_ms / 1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms / 60;
    var minutes = Math.floor(difference_ms % 60);
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
        {this.state.timeLeft && (
          <div className={"countdown-container"}>
            {this.props.displayTitle && <span>{this.props.title}</span>}
            <div className="col">
              <h3>{this.state.timeLeft.days}</h3>
              <span>days</span>
            </div>
            <div className="col">
              <h3>{this.state.timeLeft.hours}</h3>
              <span>hours</span>
            </div>
            <div className="col">
              <h3>{this.state.timeLeft.minutes}</h3>
              <span>minutes</span>
            </div>
            {this.props.displaySeconds && (
              <div className="col">
                <h3>{this.state.timeLeft.seconds}</h3>
                <span>seconds</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default CountdownTimer;
