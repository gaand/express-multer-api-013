'use strict';

const controller = require('lib/wiring/controller');
const models = require('app/models');
const Upload = models.upload;

const multer  = require('multer');
const multerUpload = multer({ dest: '/tmp/' });

const s3Upload = require('lib/aws-s3-upload');

// const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({ uploads }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Upload.findById(req.params.id)
    .then(upload => upload ? res.json({ upload }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {
  // let upload = Object.assign(req.body.upload, {
  //   _owner: req.currentUser._id,
  // });
  // Upload.create(upload)
  //   .then(upload => res.json({ upload }))
  //   .catch(err => next(err));

  s3Upload(req.file)
    .then((s3response) =>
      Upload.create({
        url: s3response.Location,
        title: req.body.image.title,
      }))
    .then((upload) => res.json({ upload }))
    .catch((err) => next(err));

  // res.json({ body: req.body, file: req.file });
};

const update = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Upload.findOne(search)
    .then(upload => {
      if (!upload) {
        return next();
      }

      delete req.body._owner;  // disallow owner reassignment.
      return upload.update(req.body.upload)
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

const destroy = (req, res, next) => {
  let search = { _id: req.params.id, _owner: req.currentUser._id };
  Upload.findOne(search)
    .then(upload => {
      if (!upload) {
        return next();
      }

      return upload.remove()
        .then(() => res.sendStatus(200));
    })
    .catch(err => next(err));
};

module.exports = controller({
  index,
  show,
  create,
  update,
  destroy,
}, { before: [
  { method: multerUpload.single('image[file]'), only: ['create'] },

  // { method: authenticate, only: ['update', 'destroy'] },
], });
