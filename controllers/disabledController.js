 const VolunteerDetail = require('../models/VolunteerDetail');
 const User = require('../models/User');

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
        console.log(newExamRequest);
        await newExamRequest.save();

        res.status(201).json({ message: "Exam request registered successfully", examRequest: newExamRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

exports.findMatchingVolunteers = async (req, res) => {
    try {
        const { examRequestId } = req.params;

        // Find the exam request
        const examRequest = await DisabledExamRequest.findById(examRequestId);
        console.log(examRequest+"exam");
        if (!examRequest) {
            return res.status(404).json({ message: "Exam request not found" });
        }

        // Extract disabled user details
        const {
            examDate,
            examSession,
            language_should_be_known_for_volunteer,
            latitude: examLatitude,
            longitude: examLongitude
        } = examRequest;

        // Fetch volunteers who match the language, session, and date
        const matchedVolunteers = await VolunteerDetail.find({
            languages_known: language_should_be_known_for_volunteer,
            available_dates: { $in: [examDate] }, // Match any date in the array
            available_session: examSession
        }).populate('userId', 'firstName _id'); // Populate firstName from User model

        // Filter by location criteria (exact match or within travel distance)
        const finalMatches = matchedVolunteers.filter(volunteer => {
            const {
                location_coordinate_latitude: volunteerLat,
                location_coordinate_longitude: volunteerLon,
                travel_distance_km
            } = volunteer;

            // Check exact location match
            const exactMatch = volunteerLat === examLatitude && volunteerLon === examLongitude;

            // Check if within travel distance
            const distance = calculateDistance(volunteerLat, volunteerLon, examLatitude, examLongitude);
            const withinTravelDistance = distance <= travel_distance_km;

            return exactMatch || withinTravelDistance;
        });

        // Format response to include firstName
        const response = finalMatches.map(volunteer => ({
            volunteerId: volunteer.userId?._id,
            firstName: volunteer.userId?.firstName, // Extract firstName from populated userId
            state: volunteer.state,
            city: volunteer.city,
            language: volunteer.languages_known,
            qualification: volunteer.qualification,
            available_dates: volunteer.available_dates,
            available_session: volunteer.available_session,
            past_experience: volunteer.past_experience,
            travel_distance_km: volunteer.travel_distance_km,
            latitude: volunteer.location_coordinate_latitude,
            longitude: volunteer.location_coordinate_longitude
        }));
        console.log(response,"response");

        res.status(200).json({ matchedVolunteers: response });

    } catch (error) {
        console.error("Error finding volunteers:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
exports.getExamDetail = async (req, res) => {
    try {
      const userId = req.user._id; // Extract userId from authenticated request
      console.log("Fetching exam details for user:", userId);
      console.log(userId+"userid")
  
      // Find the exam details associated with the logged-in disabled user and populate user details
      const examDetails = await DisabledExamRequest.findOne({ userId : userId})
        .populate({ path: "userId", select: "firstName lastName" });
        console.log(examDetails);
  
      if (!examDetails) {
        return res.status(404).json({ message: "No exam details found for this user" });
      }
  
      // Extract firstName and lastName separately
      const { firstName, lastName } = examDetails.userId;
  
      // Return combined response
      res.status(200).json({
        firstName,
        lastName,
        ...examDetails.toObject(), // Convert Mongoose object to plain JSON
      });
    } catch (error) {
      console.error("Error fetching exam details:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  


