const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatorPostsInput(data) {
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : '';

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = '内容不得少于10，且不得大于300';
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = '内容不能为空';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
