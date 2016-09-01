'use strict';

require('dotenv').load();

const s3Upload = require('../lib/aws-s3-upload');

const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload');

let file = {
  path: process.argv[2],
  title: process.argv[3],
};

s3Upload(file)
  .then((s3response) =>
    Upload.create({
      url: s3response.Location,
      title: file.title,
    }))
  .then((data) => console.log(data))
  .catch((err) => console.error(err))
  .then(() => mongoose.connection.close());
