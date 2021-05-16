import AWS from 'aws-sdk';
import env from './s3.env';

const s3Client = new AWS.S3({
  accessKeyId: env.AWS_ACCESS_KEY,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.REGION,
});

const uploadParams = {
  Bucket: env.Bucket + '/uploads',
  Key: '',
  Body: null,
};

const s3 = <any>{}; //Refactor any
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;

export default s3;
