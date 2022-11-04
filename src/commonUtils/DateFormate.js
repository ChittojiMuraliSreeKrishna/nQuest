import moment from "moment";

export function formatDate (d) {
  return moment.utc(d, "YYYY-MM-DDTHH:mm:ss Z").format('DD-MM-YYYY HH:mm:ss');
}

export function formatListDates (d) {
  console.log('++++++++++', d.split('T')[ 1 ]);
  let date = new Date(d);
  console.log({ date });
  console.log(date.getHours(), "Hours");
  return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
}

export function formatMonth (number) {
  if (number < 10) {
    return "-0" + number;
  } else {
    return "-" + number;
  }
}

export function dateFormat (number) {
  if (number < 10) {
    return "-0" + number;
  } else {
    return "-" + number;
  }
}
