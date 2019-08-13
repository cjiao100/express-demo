const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatorExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = '个人经历的标题不能为空';
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = '个人经历的公司不能为空';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = '个人经历的开始时间不能为空';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
