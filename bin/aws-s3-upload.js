'use strict';

require('dotenv').load();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');

const mime = require('mime');

const s3Upload = (options) => {

  let stream = fs.createReadStream(options.path);
  let contentType = mime.lookup(options.path);
  let ext = path.extname(options.path);
  let folder = (new Date()).toISOString().split('T')[0];

  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    ContentType: contentType,
    Key: `${folder}/keenen ivory wayans${ext}`,
    Body: stream,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

let file = {
  path: process.argv[2],
  title: process.argv[3],
};

s3Upload(file)
  .then(data => console.log(data))
  .catch(err => console.error(err));
