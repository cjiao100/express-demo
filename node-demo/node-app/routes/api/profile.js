const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

const Profiles = require('../../models/profiles');
const User = require('../../models/user');

router.get('/test', (req, res) => {
  res.json({
    msg: 'profiles works'
  });
});

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profiles.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = '该用户信息不存在';
          return res.status(404).json(errors);
        }

        res.json(profile);
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
