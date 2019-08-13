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

// 发布评论
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

// 获取评论
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

// 删除评论
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

// 点赞
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profiles.findOne({ user: req.user.id }).then(profile => {
      Posts.findById(req.params.id)
        .then(posts => {
          // 判断是否已经点赞
          if (
            posts.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.status(400).json({ alreadyliked: '该用户已赞' });
          }

          posts.likes.unshift({ user: req.user.id });
          posts.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ likederror: '点赞错误' }));
    });
  }
);

// 取消点赞
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profiles.findOne({ user: req.user.id }).then(profile => {
      Posts.findById(req.params.id)
        .then(posts => {
          // 判断是否没有点赞
          if (
            posts.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.status(400).json({ notliked: '该用户还没点赞' });
          }

          // 获取要删除的用户的id
          const removeIndex = posts.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          posts.likes.splice(removeIndex, 1);
          posts.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ likederror: '取消点赞错误' }));
    });
  }
);

// 添加评论
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatorPostsInput(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Posts.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avater: req.body.avater,
          user: req.user.id
        };

        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: '添加评论失败' }));
  }
);

// 删除评论
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Posts.findById(req.params.id)
      .then(post => {
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({ commentnotexit: '该评论不存在' });
        }

        // 找到评论的ID
        const removeIndex = post.comments
          .map(item => item.user.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: '删除评论失败' }));
  }
);

module.exports = router;
