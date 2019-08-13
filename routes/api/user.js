const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const User = require('../../models/user');
const keys = require('../../config/keys');

// 引入验证方法
const validatorRegisterInput = require('../../validation/register');
const validatorLoginInput = require('../../validation/login');

router.get('/test', (req, res) => {
  res.json({
    msg: 'login works'
  });
});

router.post('/register', (req, res) => {
  const { errors, isValid } = validatorRegisterInput(req.body);

  // 判断验证是否通过
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // console.log(req.body);
  // 查询数据库中是否拥有邮箱
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({ enail: '邮箱已被注册' });
    } else {
      const avatar = gravatar.url(req.body.name, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post('/login', (req, res) => {
  const { errors, isValid } = validatorLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({
        email: '用户不存在'
      });
    } else {
      // 密码匹配
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result) {
          // jwt.sign('规则', '加密名字', '过期时间', '箭头函数')
          const rule = {
            id: user.id,
            name: user.name
          };
          jwt.sign(
            rule,
            keys.secretOrKey,
            {
              // 设置过期时间
              expiresIn: 3600
            },
            (err, token) => {
              if (err) throw err;

              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          );
        } else {
          res.status(400).json({
            password: '密码错误'
          });
        }
      });
    }
  });
});

router.get(
  '/test/token',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
