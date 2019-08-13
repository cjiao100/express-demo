const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatorEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = '学历的学校不能为空';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = '学历的学位不能为空';
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = '学历的专业不能为空';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = '学历的开始时间不能为空';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
