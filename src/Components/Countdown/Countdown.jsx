import React, { Component } from "react";
import dateFns from "date-fns";
import PropTypes from "prop-types";
import { parseTimeString, getTimeRemaining, isEventOngoing } from "../../timer";

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
  componentDidMount() {
    this.init();
  }
  init = () => {
    var localTimes = parseTimeString(
      this.props.expiresAt,
      this.props.startDateTime
    );
    this.setState(
      { endTimes: localTimes, targetTime: localTimes[this.state.eventIndex] },
      () => this.start()
    );
  };
  // Clean up by cancelling any animation frame previously scheduled
  componentWillUnmount() {
    this.stop();
  }
  start = () => {
    this.frameId = requestAnimationFrame(this.tick);
  };
  tick = () => {
    const timeLeft = getTimeRemaining(
      this.props.startDateTime,
      this.state.endTimes,
      this.state.targetTime
    );
    if (timeLeft.total < 1) {
      this.stop();
    } else {
      this.setState(
        { timeLeft: timeLeft },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
    }
  };
  stop = () => {
    // is event currently live, if not set next target
    const { targetTime } = this.state;
    var isEventLive = isEventOngoing(
      this.props.startDateTime,
      targetTime.endTime
    );
    if (isEventLive) {
      this.setState(
        { isLiveNow: true },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
    } else {
      let nextEvent = this.state.eventIndex + 1;
      if (this.state.eventIndex === 0 && this.state.endTimes.length === 1) {
        nextEvent = 0;
        cancelAnimationFrame(this.frameId);
        this.init();
      }

      this.setState(
        {
          isLiveNow: false,
          targetTime: this.state.endTimes[nextEvent],
          eventIndex: nextEvent
        },
        () => (this.frameId = requestAnimationFrame(this.tick))
      );
      if (nextEvent === 0) {
      }
    }
  };

  getObjFromTime = dateTime => {
    return this.state.endTimes.filter(f => {
      return dateFns.isEqual(f.dateTime, dateTime);
    });
  };
  render() {
    return (
      <div>
        {this.state.timeLeft && this.state.isLiveNow === false && (
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
        {/* {this.state.isLiveNow && ( */}
        {this.state.isLiveNow === true && (
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
