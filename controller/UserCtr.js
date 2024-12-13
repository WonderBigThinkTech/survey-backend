const userDataSchema = require("../models/userdata.js");
const bcrypt = require("bcryptjs");
const smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");

const key = "real secret keys should be long and random";
// const validateRegisterInput = require("../validation/register");
// const validateLoginInput = require("../validation/login");

var encryptor = require("simple-encryptor")(key);

// Generate random string by length

const generateRandomString = (length) => {
  let result = "";

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// Generate the userID
const generateRandomNumber = (length) => {
  let result = "";

  const characters = "0123456789";

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

// Sign UP || Register
exports.register = async (req, res) => {
  // const { errors, isValid } = validateRegisterInput(req.body);
  // if (!isValid) {
  //   console.log(errors);
  //   return res.status(404).json(errors);
  // }
  console.log(req.body);
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      return res.json({ msg: "account already exist" });
    } else {
      if (req.body.email !== undefined) {
        userDataSchema
          .find()
          .sort({ _id: 1 })
          .then(async (user) => {
            const newuserDataSchema = new userDataSchema({
              email: req.body.email,
              password: req.body.password,
              phone: req.body.phone,
              name: req.body.name,
              domain: req.body.domain,
              official: "123123123",
              country : req.body.country,              
              birthday: req.body.birthday,
              role : "admin"
            });
            bcrypt.genSalt(10, (err, salt) => {
              if (err) throw err;
              newuserDataSchema
                .save()
                .then((userinfo) => {
                  return res.json({ status: true,  msg: userinfo });
                })
                .catch((err) => console.warn("warning", err));
            });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.json({ status: false, msg: "email is undefined" });
      }
    }
  });
};

// Sign In || Login
exports.login = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      if (user_data.password == req.body.password) {
        console.log(user_data);
        res.json({ status: true, msg: "Login Successed !!", currentUserData : user_data });
      } else {
        res.json({ status: false, msg: "Password is Incorrect!" });
      }
    } else {
      res.json({ status: false, msg: "email is undefined" });
    }
  });
};


exports.forgotpassword = async (req, res) => {
  userDataSchema.findOne({ phone: req.body.phone }).then(async (user_data) => {
    if (user_data) {  
        console.log(user_data.password);
        res.json({ status: true, msg: user_data.password });
    } else {
      res.json({ status: false, msg: "Phone Number is not registered!" });
    }
  });
};



// Send mail verification code
exports.sendMail = async (req, res) => {
  // Get Verifycode
  var code = generateRandomString(6);
  var transport = nodemailer.createTransport(
    smtpTransport({
      service: "Gmail",
      auth: {
        user: "stanislav.kogutstt2@gmail.com",
        pass: "phlbvyefyuiddptp",
      },
    })
  );

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "stanislav.kogutstt2@gmail.com", // sender address
    to: req.body.useremail, // list of receivers
    subject: "Verify Code", // Subject line
    html:
      `<html>
      <body>
        <div>
          Verification Link
          <p style="font-size: 32px; font-weight: bolder">
            <a
              href="https://pickorrick-build.vercel.app/verify-email?email=` +
      req.body.useremail +
      `&code=` +
      code +
      `"
              target="_blank"
              style="
                text-decoration: none;
                color: #fff;
                background: rgb(73, 144, 0);
                font-size: 24px;
                padding: 20px 30px;
                border-radius: 10px;
              "
            >
              Verification
            </a>
          </p>
        </div>
      </body>
    </html>`,
  };

  // send mail with defined transport object
  transport.sendMail(mailOptions, function (error, response) {
    if (error) {
      res.send({ error: "Something wrong!" });
      console.log(error);
    } else {
      console.log("Suceess");
    }
  });
};

// Checking the email is exsiting
exports.check_email_exist = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      return res.json({ msg: "account already exist", status: false });
    } else {
      return res.json({ msg: "account is new", status: true });
    }
  });
};

//get user data
exports.getUserData = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      res.json({
        status: true,
        email: user_data.email,
        firstname: user_data.firstname,
        lastname: user_data.lastname,
        nick_name: user_data.nick_name,
        VIP_level: user_data.VIP_level,
        user_type: user_data.user_type,
        following: user_data.following,
        followers: user_data.followers,
      });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

exports.getAllUser = async (req, res) => {
  try {
    const users = await userDataSchema.find();
    res.json(users);
    console.log(users);
  } catch (err) {
    res.json({ status: false, msg: "Users do not exist!" });
  }
};

// Update user nick name
exports.update_nick_name = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.nick_name = req.body.nick_name;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({ status: false, msg: "updating Nick_name is faled" });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

// update_increase_following
exports.update_increase_following = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.following++;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({
            status: false,
            msg: "update_increase_following is faled",
          });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

// update_increase_followers
exports.update_increase_followers = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.followers++;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({
            status: false,
            msg: "update_increase_followers is faled",
          });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

// update_decrease_following
exports.update_decrease_following = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.following--;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({
            status: false,
            msg: "update_increase_followers is faled",
          });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

// update_decrease_followers
exports.update_decrease_followers = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.followers--;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({
            status: false,
            msg: "update_increase_followers is faled",
          });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

// update_firstname api
exports.update_firstname = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.firstname = req.body.firstname;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({ status: false, msg: "updating firstname is faled" });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};

// update_lastname api

exports.update_lastname = async (req, res) => {
  userDataSchema.findOne({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      user_data.lastname = req.body.lastname;
      user_data
        .save()
        .then((updated_user) => {
          res.json(updated_user);
        })
        .catch((err) => {
          res.json({ status: false, msg: "updating lastname is faled" });
        });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};


exports.deleteUser = async (req, res) => {
  userDataSchema.findOneAndDelete({ email: req.body.email }).then(async (user_data) => {
    if (user_data) {
      res.json({ status: true, msg: "user is deleted successfully" });
    } else {
      res.json({ status: false, msg: "user is not registered!" });
    }
  });
};
exports.deleteUsers = async (req, res) => {
  const { emails } = req.body; // Expecting an array of emails in the request body
  if (!emails || !Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({ status: false, msg: "No emails provided" });
  }

  try {
    const result = await userDataSchema.deleteMany({ email: { $in: emails } }); // Delete multiple users
    if (result.deletedCount > 0) {
      res.json({ status: true, msg: `${result.deletedCount} users deleted successfully` });
    } else {
      res.json({ status: false, msg: "No users found with the provided emails" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "An error occurred while deleting users" });
  }
};