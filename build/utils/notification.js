"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendNotification = sendNotification;
exports.sendNotifications = sendNotifications;

var admin = _interopRequireWildcard(require("firebase-admin"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function sendNotification({
  fcmToken,
  data,
  title,
  body
}) {
  try {
    admin.messaging().send({
      data,
      token: fcmToken,
      notification: {
        title,
        body
      },
      android: {
        priority: 'high'
      }
    });
  } catch (error) {
    console.log(error);
  }
}

function sendNotifications({
  tokens,
  data,
  title,
  body
}) {
  admin.messaging().sendMulticast({
    tokens,
    data,
    notification: {
      title,
      body
    },
    android: {
      priority: 'high'
    }
  });
}