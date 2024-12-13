const questionDataSchema = require("../models/questiondata.js");
const bcrypt = require("bcryptjs");
const smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");

const generateRandomNumber = (length) => {
  let result = "";

  const characters = "0123456789";

  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

exports.create = async (req, res) => {
  try {
    if (req.body.description !== undefined) {
      const userid = generateRandomNumber(9);
      const newQuestion = new questionDataSchema({
        title: req.body.title,
        description: req.body.description,
        inputType: req.body.inputType,
        options: req.body.options,
        userId: userid,
      });
      await newQuestion.save();
      
      return res.json({ status: true, newQuestion });
    } else {
      return res.json({ status: false, msg: "Email is undefined" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "An error occurred" });
  }
};

exports.getAllQuestions = async (req, res) => {
  try {
    const questions = await questionDataSchema.find();
    res.json({ status: true, questions});
    console.log(questions);
  } catch (err) {
    res.json({ status: false, msg: "Questions do not exist!" });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the question ID is passed as a URL parameter.
    const deletedQuestion = await questionDataSchema.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ status: false, msg: "Question not found" });
    }

    res.json({ status: true, msg: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "An error occurred while deleting the question" });
  }
};

exports.updateQuestion = async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter.
    const { title, description, inputType, options } = req.body; // Get updated fields from the request body.

    if (!title || !description || !inputType || !options) {
      return res.status(400).json({ status: false, msg: "Missing required fields" });
    }

    const updatedQuestion = await questionDataSchema.findByIdAndUpdate(
      id,
      { title, description, inputType, options },
      { new: true } // Return the updated document.
    );

    if (!updatedQuestion) {
      return res.status(404).json({ status: false, msg: "Question not found" });
    }

    res.json({ status: true, updatedQuestion });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: "An error occurred while updating the question" });
  }
};
