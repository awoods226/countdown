import React, { Component } from "react";
import dateFns from "date-fns";
import PropTypes from "prop-types";

class CountdownTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endTimes: undefined,
      timeLeft: undefined
    };
  }
  parseTimeString = expiresAt => {
    if (!expiresAt) {
      console.log("ERROR: Expiration seed date required");
      return;
    }
    var timeStringArray = expiresAt.split(",");

    var now = this.props.startDateTime;
    var currentDay = dateFns.getDay(now);
    var localTimes = timeStringArray.map(f => {
      var newDate = this.props.startDateTime;

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

      return {
        dateTime: dateFns.parse(newDate),
        duration: parseInt(duration)
      };
    });
    this.setState({ endTimes: localTimes }, () => this.start());
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
  getObjFromTime = dateTime => {
    return this.state.endTimes.filter(f => {
      return dateFns.isEqual(f.dateTime, dateTime);
    });
  };
  isEventLiveNow = () => {
    // get entire obj
    // let selectedTarget = this.state.endTimes.filter(et => {
    //   return dateFns.isEqual(et.dateTime, endTarget);
    // });
    // let diff = dateFns.differenceInMinutes(endTarget, now);

    // get closest event that aleady happened today
    const { startDateTime } = this.props;
    let potentialLiveEvents = this.state.endTimes.filter(et => {
      let dayDiff = dateFns.differenceInDays(et.dateTime, startDateTime);
      if (dayDiff === 0) {
        return et;
      }
    });
    let closestPotential = dateFns.closestTo(
      startDateTime,
      potentialLiveEvents.map(ple => ple.dateTime)
    );
    let closestObj = this.getObjFromTime(closestPotential);
    if (
      dateFns.differenceInMinutes(closestPotential, startDateTime) <=
      closestObj.duration
    ) {
      // event is live now
      console.log("LIVE NOW");
    }
  };
  getTimeRemaining = () => {
    if (!this.state.endTimes) {
      return;
    }
    const { startDateTime } = this.props;
    // remove any events that already happened today
    let potentialDates = this.state.endTimes.filter(et => {
      // TODO: modify this so it will only remove dates that already occoured on the same day as today
      // if date diff === 0, continue to next check
      if (dateFns.differenceInDays(et.dateTime, startDateTime) > 0) {
        let isAFter = dateFns.isAfter(et.dateTime, startDateTime);
        if (isAFter) {
          return et;
        }
      }
    });
    let now = this.props.startDateTime;
    var endTarget = dateFns.closestTo(
      now,
      potentialDates.map(f => {
        return f.dateTime;
      })
    );
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
      </div>
    );
  }
}

CountdownTimer.defaultProps = {
  startDateTime: new Date()
};

CountdownTimer.propTypes = {
  expiresAt: PropTypes.string,
  title: PropTypes.string,
  displayTitle: PropTypes.bool,
  displaySeconds: PropTypes.bool,
  startDateTime: PropTypes.instanceOf(Date).isRequired
};

export default CountdownTimer;
