import React from "react";
import ReactDOM from "react-dom";
import CountdownTimer from "./Components/Countdown/Countdown";

var root = document.getElementById("timer-root");

ReactDOM.render(
  <CountdownTimer
    expiresAt={root.dataset.service}
    title={root.dataset.title}
    displayTitle={false}
    displaySeconds={false}
  />,
  root
);
