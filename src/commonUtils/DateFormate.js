import moment from "moment";

export function formatDate (d) {
  return moment.utc(d, "YYYY-MM-DDTHH:mm:ss Z").format('DD-MM-YYYY HH:mm:ss');
}

export function formatListDates (d) {
  return moment.utc(d, "YYYY-MM-DD Z").format('DD-MM-YYYY');
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
