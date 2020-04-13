"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDaysInRange = exports.getMonthsInRange = void 0;

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getMonthsInRange = (start, end) => {
  const result = [];
  const curr = (0, _moment.default)(start);

  while ((0, _moment.default)(curr).isSameOrBefore((0, _moment.default)(end))) {
    result.push((0, _moment.default)(curr).format('MM/YYYY'));
    curr.add(1, 'month');
  }

  return result;
};

exports.getMonthsInRange = getMonthsInRange;

const getDaysInRange = (start, end) => {
  const result = [];
  const curr = (0, _moment.default)(start);

  while ((0, _moment.default)(curr).isSameOrBefore((0, _moment.default)(end))) {
    result.push((0, _moment.default)(curr).format('DD/MM/YYYY'));
    curr.add(1, 'day');
  }

  return result;
};

exports.getDaysInRange = getDaysInRange;