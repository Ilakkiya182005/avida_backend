 const VolunteerDetail = require('../models/VolunteerDetail');


const DisabledExamRequest = require("../models/DisabledExamRequest");
const { validationResult } = require("express-validator");

exports.registerExamRequest = async (req, res) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Create a new exam request
        const newExamRequest = new DisabledExamRequest(req.body);
        await newExamRequest.save();

        res.status(201).json({ message: "Exam request registered successfully", examRequest: newExamRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const matchVolunteers = require("../utils/matchVolunteers");

exports.findMatchingVolunteers = async (req, res) => {
    try {
        const examRequest = await DisabledExamRequest.findById(req.params.examRequestId);
        if (!examRequest) {
            return res.status(404).json({ error: "Exam request not found" });
        }

        // Fetch volunteers and populate firstName and lastName from User model
        const volunteers = await VolunteerDetail.find()
            .populate("userId", "firstName lastName") // Populate firstName & lastName from User model
            .select("userId state city languages_known qualification available_dates available_session past_experience travel_distance_km");

        // Find matching volunteers
        const matchedVolunteers = await matchVolunteers(examRequest, volunteers);

        if (matchedVolunteers.length === 0) {
            return res.status(200).json({ message: "No matching volunteers found", matchedVolunteers: [] });
        }

        res.status(200).json({ matchedVolunteers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
