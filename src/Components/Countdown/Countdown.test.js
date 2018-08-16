import React from "react";
import { shallow, mount } from "enzyme";
import Countdown from "./Countdown";
import dateFns from "date-fns";

//data-service="2018-05-08T09:30" data-title="Countdown to Live Service"/>

it("renders without crashing", () => {
  shallow(
    <Countdown
      expiresAt={"2018-05-08T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={new Date()}
    />
  );
});

it("properly handles missing props", () => {
  shallow(<Countdown />);
});

it("displays correct day", () => {
  const now = new Date("2018-08-04T09:30");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-05T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const days = (
    <div className="col cd-days">
      <h3>01</h3>
      <span>days</span>
    </div>
  );
  expect(wrapper).toContainReact(days);
});

it("displays correct hour", () => {
  const now = new Date("2018-08-04T04:30");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-05T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const hours = (
    <div className="col cd-hours">
      <h3>05</h3>
      <span>hours</span>
    </div>
  );
  expect(wrapper).toContainReact(hours);
});

it("displays correct minutes", () => {
  const now = new Date("2018-08-04T04:15");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-05T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const minutes = (
    <div className="col cd-minutes">
      <h3>15</h3>
      <span>minutes</span>
    </div>
  );
  expect(wrapper).toContainReact(minutes);
});

it("processes seed date correctly", () => {
  const now = new Date("2018-07-06T04:15");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-05T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const days = (
    <div className="col cd-days">
      <h3>02</h3>
      <span>days</span>
    </div>
  );
  const hours = (
    <div className="col cd-hours">
      <h3>05</h3>
      <span>hours</span>
    </div>
  );
  const minutes = (
    <div className="col cd-minutes">
      <h3>15</h3>
      <span>minutes</span>
    </div>
  );
  expect(wrapper).toContainReact(days);
  expect(wrapper).toContainReact(hours);
  expect(wrapper).toContainReact(minutes);
});

it("counts down to closest expiration seed", () => {
  const now = new Date("2018-08-04T09:30");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-08T09:30,2018-08-05T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const days = (
    <div className="col cd-days">
      <h3>01</h3>
      <span>days</span>
    </div>
  );
  expect(wrapper).toContainReact(days);
});

it("counts down to next expiration seed after the first has ended", () => {
  const now = dateFns.parse("2018-08-05T07:30");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-05T03:30,2018-08-05T09:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const hours = (
    <div className="col cd-hours">
      <h3>02</h3>
      <span>hours</span>
    </div>
  );
  expect(wrapper).toContainReact(hours);
});

it("displays live now", () => {
  const now = dateFns.parse("2018-08-05T07:30");
  const wrapper = mount(
    <Countdown
      expiresAt={"2018-08-05T03:30d1:02,2018-08-05T09:30d0:30"}
      title={"Unit test"}
      displayTitle={false}
      displaySeconds={false}
      startDateTime={now}
    />
  );
  const hours = (
    <div className="col cd-hours">
      <h3>02</h3>
      <span>hours</span>
    </div>
  );
  expect(wrapper).toContainReact(hours);
});
