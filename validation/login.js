const Validator = require("validator");
const isEmpty = require("./is_empty");

//data is an object of things to validate
module.exports = function validateLoginInput(data) {
  let errors = {};

  //isEmpty needs to check a string
  // these two lines check if the data is set to null or undefined, if they are, set them two an empty string

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
