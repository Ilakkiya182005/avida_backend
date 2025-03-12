const { body } = require("express-validator");

const validateExamRequest = [
    body("userId").notEmpty().withMessage("User ID is required").isMongoId().withMessage("Invalid User ID"),
    body("examName").notEmpty().withMessage("Exam Name is required"),
    body("examVenue").notEmpty().withMessage("Exam Venue is required"),
    body("examSession")
        .notEmpty().withMessage("Exam Session is required")
        .isIn(["morning", "afternoon", "evening"]).withMessage("Exam Session must be 'morning', 'afternoon', or 'evening'"),
    body("examDate")
        .notEmpty().withMessage("Exam Date is required")
        .isISO8601().toDate().withMessage("Exam Date must be in YYYY-MM-DD format"),
    body("qualification_needed_for_volunteer")
        .notEmpty().withMessage("Qualification is required")
        .isIn(["10th", "12th", "UG", "PG", "Diploma"]).withMessage("Invalid Qualification"),
    body("language_should_be_known_for_volunteer")
        .isArray({ min: 1 }).withMessage("At least one language is required")
        .custom(value => value.every(lang => ["Tamil", "English", "Others"].includes(lang)))
        .withMessage("Languages must be 'Tamil', 'English', or 'Others'"),
    body("gender")
        .notEmpty().withMessage("Gender is required")
        .isIn(["Male", "Female"]).withMessage("Gender must be 'Male' or 'Female'"),
];

module.exports = { validateExamRequest };
