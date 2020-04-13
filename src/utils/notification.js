import * as admin from 'firebase-admin';

export function sendNotification({ fcmToken, data, title, body }) {
  admin.messaging().send({
    data,
    token: fcmToken,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high',
    },
  });
}

export function sendNotifications({ tokens, data, title, body }) {
  admin.messaging().sendMulticast({
    tokens,
    data,
    notification: {
      title,
      body,
    },
    android: {
      priority: 'high',
    },
  });
}
