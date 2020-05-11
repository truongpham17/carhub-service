"use strict";

var _nodeSchedule = _interopRequireDefault(require("node-schedule"));

var _lease = _interopRequireDefault(require("./lease.model"));

var _notification = require("../../utils/notification");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_nodeSchedule.default.scheduleJob('0 0 17 * * *', async function () {
  console.log(1);
  const overdueLeases = await _lease.default.find({
    isActive: true,
    status: 'ACCEPTED',
    startDate: {
      $gte: new Date(Date.now() - 86400000) // $lte: new Date(),

    }
  }).populate('customer');

  if (overdueLeases && overdueLeases.length > 0) {
    overdueLeases.forEach(async lease => {
      (0, _notification.sendNotification)({
        title: 'Your leasing is overdue',
        body: 'Your leasing is overdue, so we cancel your request. Thanks for using our service',
        data: {},
        fcmToken: lease.customer.fcmToken
      });
      lease.status = 'CANCEL';
      await lease.save();
    });
  }
});