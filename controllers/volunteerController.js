const { body, validationResult } = require("express-validator");
const VolunteerDetail = require("../models/VolunteerDetail");
const User = require("../models/User");

// Validation middleware
const validateVolunteerRegistration = [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("state").notEmpty().withMessage("State is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("qualification").notEmpty().withMessage("Qualification is required"),
    body("available_dates")
        .isArray({ min: 1 }).withMessage("At least one available date is required")
        .custom((value) => value.every(date => /^\d{4}-\d{2}-\d{2}$/.test(date))).withMessage("Dates must be in YYYY-MM-DD format"),
    body("past_experience")
        .notEmpty().withMessage("Past experience is required")
        .isIn(["yes", "no"]).withMessage("Experience must be 'yes' or 'no'"),
    body("travel_distance_km")
        .isNumeric().withMessage("Travel distance must be a number")
        .custom(value => value > 0).withMessage("Travel distance must be greater than zero"),
];
const validateVolunteerProfileUpdate = [
  body("qualification")
      .optional()
      .isIn(["10th", "12th", "Diploma", "UG", "PG"])
      .withMessage("Invalid qualification"),
  body("available_dates")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one available date is required")
      .custom((value) => value.every(date => /^\d{4}-\d{2}-\d{2}$/.test(date)))
      .withMessage("Dates must be in YYYY-MM-DD format"),
  body("available_session")
      .optional()
      .isArray({ min: 1 })
      .withMessage("At least one available session is required")
      .custom((value) => value.every(session => ["Morning", "Afternoon", "Evening"].includes(session)))
      .withMessage('Sessions must be "morning", "afternoon", or "evening"'),

  body("city")
      .optional()
      .notEmpty()
      .withMessage("City cannot be empty"),
];


// Controller function
const registerVolunteer = async (req, res) => {
  try {
    if (req.user.userType !== "Volunteer") {
      return res.status(403).json({ message: "Access Denied: Only volunteers can register volunteer details" });
    }
    console.log("User ID received:", req.user._id);

    // Validate the request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Ensure the user exists
    const userExists = await User.findById(req.user._id);
    if (!userExists) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Create a new volunteer entry
    const newVolunteer = new VolunteerDetail({ ...req.body, userId: req.user._id});
    console.log(newVolunteer);
    await newVolunteer.save();

    res.status(201).json(newVolunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const updateVolunteerProfile = async (req, res) => {
  try {
      console.log("Updating Volunteer Profile for User ID:", req.user._id);

      // Validate request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      // Find existing volunteer profile
      const volunteer = await VolunteerDetail.findOne({ userId: req.user._id });
      if (!volunteer) {
          return res.status(404).json({ message: "Volunteer profile not found" });
      }

      // Update only allowed fields
      const allowedUpdates = ["qualification", "available_dates", "available_session", "language_known", "city"];
      Object.keys(req.body).forEach((key) => {
          if (allowedUpdates.includes(key)) {
              volunteer[key] = req.body[key];
          }
      });

      await volunteer.save();

      res.status(200).json({ message: "Volunteer profile updated successfully", updatedProfile: volunteer });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Extract userId from authenticated request
    console.log("Fetching user details for user:", userId);

    // Find the volunteer details associated with the logged-in user and populate user details
    const volDetails = await VolunteerDetail.findOne({ userId }).populate({
      path: "userId", // Assuming userId in VolunteerDetail references User model
      select: "firstName lastName emailId", // Fetch only these fields from User model
    });

    if (!volDetails) {
      return res.status(404).json({ message: "No volunteer details found for this user" });
    }

    // Construct response including both VolunteerDetail and User details
    const response = {
      firstName: volDetails.userId.firstName,
      lastName: volDetails.userId.lastName,
      emailId: volDetails.userId.emailId,
      ...volDetails._doc, // Spread to include volunteer details
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching volunteer details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Export functions
module.exports = {
  validateVolunteerRegistration,
  registerVolunteer,
  updateVolunteerProfile,
  validateVolunteerProfileUpdate,
  getUserProfile
};


