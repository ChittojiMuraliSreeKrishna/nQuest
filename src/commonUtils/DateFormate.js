export function formatDate(d) {
  let date = new Date(d)
  return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
}

export function formatMonth(number) {
  if (number < 10) {
    return "-0" + number;
  } else {
    return "-" + number;
  }
}

export function dateFormat(number) {
  if (number < 10) {
    return "-0" + number;
  } else {
    return "-" + number
  }
}