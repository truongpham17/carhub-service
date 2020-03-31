import express from 'express';
import * as admin from 'firebase-admin';
import constants from './config/constants';
import configMiddleware from './config/middlewares';
import './config/database';
import routesConfig from './module';
import serviceAccount from './config/admin-sdk.json';

const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://car-hub-d2912.firebaseio.com',
});

// admin
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
//       'duoqR2Jc9iM:APA91bFmIO8rAsBK7VOpmFOelkg3S6jvnNzrf5v5ZfrvGEDB-7RbcxtN2vqRSTREEhtPgax282wMoa1_Vb72zcgQPh1tX2oFVLPlPX_iI-k4ZEFBjctwz2ek14bhuoRXcgaT6sTh7Ykh',
//   })
//   .then(() => console.log('success'))
//   .catch(error => console.log(error));

configMiddleware(app);

routesConfig(app);

app.listen(constants.PORT, () => {
  console.log('CAR HUB SERVICE STARTS');
  console.log(`
      PORT:       ${constants.PORT}
      ENV:        ${process.env.NODE_ENV}`);
});

process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});
