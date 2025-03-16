const { body } = require("express-validator");

const validateExamRequest = [
    body("examName").notEmpty().withMessage("Exam Name is required"),
    body("examVenue").notEmpty().withMessage("Exam Venue is required"),
    body("examSession")
        .notEmpty().withMessage("Exam Session is required")
        .isIn(["Morning", "Afternoon", "Evening"]).withMessage("Exam Session must be 'morning', 'afternoon', or 'evening'"),
    body("examDate")
        .notEmpty().withMessage("Exam Date is required")
        .isISO8601().toDate().withMessage("Exam Date must be in YYYY-MM-DD format"),
    body("qualification_needed_for_volunteer")
        .notEmpty().withMessage("Qualification is required")
        .isIn(["10th", "12th", "UG", "PG", "Diploma"]).withMessage("Invalid Qualification"),
    body("gender")
        .notEmpty().withMessage("Gender is required")
        .isIn(["Male", "Female"]).withMessage("Gender must be 'Male' or 'Female'"),
];

module.exports = { validateExamRequest };
