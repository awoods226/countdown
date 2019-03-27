import dateFns from "date-fns";
import { parseTimeString, getTimeRemaining, isEventOngoing } from "../../timer";

it("can parseTime string", () => {
  const expiresAt = "2018-08-05T03:30d1:02,2018-08-05T09:30d0:30";
  const startTime = dateFns.parse("2018-08-05T07:30");
  var timeLeft = parseTimeString(expiresAt, startTime);
  expect(timeLeft).toBeTruthy();
});
