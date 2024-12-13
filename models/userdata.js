let mongoose = require("mongoose");

var objUserData = {
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  domain: {
    type: String,
    required: true,
  },
  official: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  role: {
    type : String,
    required : true,
  }

 
};

let userdataSchemaInstance = mongoose.Schema(objUserData);
var UserDataSchema = (module.exports = mongoose.model(
  "userDataSchema",
  userdataSchemaInstance
));

module.exports.getUsers = function (callback, limit) {
  UserDataSchema.find(callback).limit(limit);
};
