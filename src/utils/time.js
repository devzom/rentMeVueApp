function msToTime(ms) {
  return {
    hours: Math.trunc(ms / 3600000),
    minutes:
      Math.trunc((ms / 3600000 - Math.trunc(ms / 3600000)) * 60) +
      (((ms / 3600000 - Math.trunc(ms / 3600000)) * 60) % 1 !== 0 ? 1 : 0)
  };
}

function dateDifferenceMilliseconds(date1, date2) {
  const startTime = new Date(date1);
  const endTime = new Date(date2);
  return Math.abs(endTime - startTime);
}

function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

Date.prototype.toISOString = function() {
  return (
    this.getUTCFullYear() +
    "-" +
    pad(this.getUTCMonth() + 1) +
    "-" +
    pad(this.getUTCDate()) +
    "T" +
    pad(this.getUTCHours()) +
    ":" +
    pad(this.getUTCMinutes()) +
    ":" +
    pad(this.getUTCSeconds()) +
    "+00:00"
  );
};

var currentTimestampS = new Date();
var currentTimestamp = new Date().toISOString();
var oneHourLater = new Date(
  currentTimestampS.getTime() + 60 * 60000
).toISOString();

export { msToTime, dateDifferenceMilliseconds };
