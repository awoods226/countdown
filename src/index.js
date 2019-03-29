import React from "react";
import ReactDOM from "react-dom";
import CountdownTimer from "./Components/Countdown/Countdown";
// import dateFns from "date-fns";
var root = document.getElementById("timer-root");

ReactDOM.render(
  <CountdownTimer
    // startDateTime={dateFns.parse("2018-08-05T15:48")}
    expiresAt={root.dataset.service}
    title={root.dataset.title}
    displayTitle={false}
    displaySeconds={false}
  />,
  root
);
