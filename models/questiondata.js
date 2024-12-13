const mongoose = require("mongoose");

// Define the schema for the questions
const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  inputType: {
    type: String,
    enum: ["text", "checkbox", "radio"], // Restrict to valid input types
    required: true,
  },
  options: {
    type: [String], // Array of strings for options
    validate: {
      validator: function (v) {
        return v.length > 0; // Ensure at least one option is provided
      },
      message: "Options array must have at least one item",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create a model from the schema
const QuestionModel = mongoose.model("Question", questionSchema);

// Export the model and utility functions
module.exports = QuestionModel;

/**
 * Fetch all questions with optional limit.
 * @param {Function} callback - The callback function to handle the result.
 * @param {Number} [limit] - Optional limit for the number of results.
 */
module.exports.getQuestions = function (callback, limit) {
  QuestionModel.find(callback).limit(limit);
};

/**
 * Add a new question to the database.
 * @param {Object} questionData - The data for the new question.
 * @param {Function} callback - The callback function to handle the result.
 */
// module.exports.addQuestion = function (questionData, callback) {
//   QuestionModel.create(questionData, callback);
// };
