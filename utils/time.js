import moment from 'moment';

export const getMonthsInRange = (start, end) => {
  const result = [];
  let curr = moment(start);
  while (moment(curr).isBefore(moment(end))) {
    result.push(moment(curr).format('MM/YYYY'));
    curr.add(1, 'month');
  }
  return result;
}