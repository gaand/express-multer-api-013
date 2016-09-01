'use strict';

require('dotenv').load();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const fs = require('fs');
const path = require('path');

const mime = require('mime');

let file = {
  path: process.argv[2],
  title: process.argv[3],
};

let stream = fs.createReadStream(file.path);
let contentType = mime.lookup(file.path);
let ext = path.extname(file.path);

const params = {
  ACL: 'public-read',
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  ContentType: contentType,
  Key: 'keenen ivory wayans' + ext,
  Body: stream,
};

s3.upload(params, function (err, data) {
  console.log(err, data);
});
