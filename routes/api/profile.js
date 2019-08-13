const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

const Profiles = require('../../models/profiles');
const User = require('../../models/user');
const validataProfileInput = require('../../validation/profile');
const validatorExperienceInput = require('../../validation/experience');
const validatorEducationInput = require('../../validation/education');

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
      .populate('user', ['name', 'avatart'])
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

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validataProfileInput(req.body);
    const profileFields = {};
    profileFields.user = req.user.id;

    if (!isValid) {
      return res.status(400).json(errors);
    }

    if (req.body.handle) {
      profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
      profileFields.company = req.body.company;
    }
    if (req.body.website) {
      profileFields.website = req.body.website;
    }
    if (req.body.location) {
      profileFields.location = req.body.location;
    }
    if (req.body.status) {
      profileFields.status = req.body.status;
    }
    if (req.body.bio) {
      profileFields.bio = req.body.bio;
    }
    if (req.body.githubusername) {
      profileFields.githubusername = req.body.githubusername;
    }

    if (req.body.wechat) {
      profileFields.social.wechat = req.body.wechat;
    }
    if (req.body.QQ) {
      profileFields.social.QQ = req.body.QQ;
    }
    if (req.body.tengxunkt) {
      profileFields.social.tengxunkt = req.body.tengxunkt;
    }
    if (req.body.wangyikt) {
      profileFields.social.wangyikt = req.body.wangyikt;
    }

    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    Profiles.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // 已经有用户信息，执行更新方法
        Profiles.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // 没有用户信息，执行创建方法
        Profiles.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = '该用户已有个人信息';
            res.status(400).json(errors);
          }

          new Profiles(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

//  通过handle获取用户信息
router.get('/handle/:handle', (req, res, next) => {
  const errors = {};
  Profiles.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatart'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = '没有个人信息';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

// 用过用户ID获取信息
router.get('/user/:user_id', (req, res, next) => {
  const errors = {};
  Profiles.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatart'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = '没有个人信息';
        return res.status(404).json(errors);
      }

      res.json(profile);
    })
    .catch(err => res.status(400).json(err));
});

// 获取全部用户信息
router.get('/all', (req, res) => {
  const errors = {};
  Profiles.find()
    .populate('user', ['name', 'avatart'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = '没有用户信息';
        res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch(err => res.status(400).json(err));
});

// 添加个人经历
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatorExperienceInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profiles.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          current: req.body.current,
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          description: req.body.description
        };

        profile.experience.unshift(newExp);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

// 添加个人学历
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatorEducationInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    Profiles.findOne({ user: req.user.id })
      .then(profile => {
        const newEdu = {
          current: req.body.current,
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          description: req.body.description
        };

        profile.education.unshift(newEdu);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

// 删除个人经历
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profiles.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

// 删除个人学历
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profiles.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        profile.education.splice(removeIndex, 1);

        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(400).json(err));
  }
);

// 删除用户
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profiles.findOneAndRemove({ user: req.user.id })
      .then(() => {
        User.findOneAndRemove({ _id: req.user.id }).then(() =>
          res.json({ success: true })
        );
      })
      .catch(err => res.status(400).json(err));
  }
);

module.exports = router;
