// import AWS from 'aws-sdk';
// import { throwError } from './methods';

// AWS.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
// });

// const s3 = new AWS.S3();

// export const uploadFileS3 = (
//   stream,
//   parentModel,
//   parentId,
//   contentType = 'application/octet-stream'
// ) => {
//   if (!parentModel || !parentId) {
//     throwError('Parent missing', 500);
//   }

//   const key = `${process.env.NODE_ENV ||
//     'prod'}/${parentModel.toLowerCase()}/${parentId.toLowerCase()}/${parentId.toLowerCase()}-${Date.now()}`;
//   const params = {
//     Bucket: 'khongfap',
//     Body: stream,
//     Key: key,
//     ContentType: contentType,
//     ACL: 'public-read',
//   };

//   return new Promise(function(resolve, reject) {
//     s3.upload(params, function(err, data) {
//       // handle error
//       if (err) {
//         reject(err);
//       }
//       // success
//       if (data) {
//         resolve(data);
//       }
//     });
//   });
// };
