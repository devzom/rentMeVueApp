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

function dateDifferenceDays(date1, date2) {
  const startTime = new Date(date1);
  const endTime = new Date(date2);

  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export { msToTime, dateDifferenceMilliseconds, dateDifferenceDays };
