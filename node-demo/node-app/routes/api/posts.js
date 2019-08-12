const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Posts = require('../../models/posts');
const Profiles = require('../../models/profiles');
const validatorPostsInput = require('../../validation/posts');

router.get('/test', (req, res) => {
  res.json({
    msg: 'post works'
  });
});

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatorPostsInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Posts({
      text: req.body.text,
      name: req.body.name,
      avater: req.body.avater,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

router.get('/', (req, res) => {
  Posts.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: '找不到任何评论信息' }));
});

router.get('/:id', (req, res) => {
  Posts.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: '找不到评论信息' }));
});

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profiles.findOne({ user: req.user.id }).then(profile => {
      Posts.findById(req.params.id)
        .then(posts => {
          // 判断是否位本人
          if (posts.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: '用户非法操作' });
          }

          posts.remove().then(() => res.json({ success: '删除成功' }));
        })
        .catch(err => res.status(404).json({ nopostsfound: '找不到评论信息' }));
    });
  }
);

module.exports = router;
