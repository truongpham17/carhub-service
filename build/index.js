"use strict";

var _express = _interopRequireDefault(require("express"));

var admin = _interopRequireWildcard(require("firebase-admin"));

var _constants = _interopRequireDefault(require("./config/constants"));

var _middlewares = _interopRequireDefault(require("./config/middlewares"));

require("./config/database");

var _module = _interopRequireDefault(require("./module"));

var _adminSdk = _interopRequireDefault(require("./config/admin-sdk.json"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();
admin.initializeApp({
  credential: admin.credential.cert(_adminSdk.default),
  databaseURL: 'https://car-hub-d2912.firebaseio.com'
}); // admin
//   .messaging()
//   .send({
//     data: {
//       // action: 'NAVIGATE',
//       // screenName: 'HistoryScreen',
//     },
//     android: {
//       priority: 'high',
//     },
//     notification: {
//       title: 'hello friend',
//       body: 'Hello friend con cu ',
//     },
//     token:
//       'd5ypTm3oei4:APA91bFd6B_8mXM4zOUQ2FdgWz5cB1NqNzLPG2CKwDKNN9AXa1LjjwOEVOjxWNnAgSlL0JeyIKg_MnpesRJkumkRyIcgc5XP0JXwFuMU4EiLdZooJdQibC2JOnBYqzvUuCAzLPcrR9Li',
//   })
//   .then(() => console.log('success'))
//   .catch(error => console.log(error));

(0, _middlewares.default)(app);
(0, _module.default)(app);
app.listen(_constants.default.PORT, () => {
  console.log('CAR HUB SERVICE STARTS');
  console.log(`
      PORT:       ${_constants.default.PORT}
      ENV:        ${process.env.NODE_ENV}`);
});
process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});