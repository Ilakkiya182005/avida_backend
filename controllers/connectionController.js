const ConnectionRequest = require('../models/ConnectionRequest');
const DisabledExamRequest = require('../models/DisabledExamRequest');
const VolunteerDetail = require('../models/VolunteerDetail');


exports.sendConnectionRequest = async (req, res) => {
    try {
        const { examRequestId } = req.params;

        if (req.user.userType !== "Disabled") {
            return res.status(403).json({ error: "Only disabled users can send connection requests" });
        }

        const disabledUserId = req.user._id;
        console.log("Fetching Exam Request for ID:", examRequestId);

        const examRequest = await DisabledExamRequest.findById(examRequestId);
        if (!examRequest) {
            return res.status(404).json({ error: "Exam request not found" });
        }
        console.log("Exam Request Details:", examRequest);

        const volunteers = await VolunteerDetail.find({
            city: examRequest.examVenue,
            available_dates: { $in: [new Date(examRequest.examDate)] }, // Convert to Date object
            available_session: { $in: [examRequest.examSession] },
            qualification: examRequest.qualification_needed_for_volunteer,
            languages_known: { $in: examRequest.language_should_be_known_for_volunteer }
        });
        
        console.log(volunteers);

        console.log("Matched Volunteers Before Filtering:", volunteers.length);

        if (volunteers.length === 0) {
            return res.status(404).json({ error: "No matching volunteers found" });
        }

        const existingRequests = await ConnectionRequest.find({
            disabledUserId,
            volunteerUserId: { $in: volunteers.map(v => v.userId) },
            status: { $in: ["pending", "accepted"] }
        });

        console.log("Existing Requests:", existingRequests.length);

        if (existingRequests.length === volunteers.length) {
            return res.status(400).json({ message: "Requests already sent to all matching volunteers" });
        }

        const newVolunteers = volunteers.filter(v => !existingRequests.some(req => req.volunteerUserId.toString() === v.userId.toString()));

        if (newVolunteers.length === 0) {
            return res.status(404).json({ error: "No new volunteers available for request" });
        }

        const connectionRequests = newVolunteers.map(volunteer => ({
            disabledUserId,
            volunteerUserId: volunteer.userId,
            status: "pending"
        }));

        await ConnectionRequest.insertMany(connectionRequests);

        res.status(201).json({
            message: "Connection requests sent",
            matchedVolunteers: newVolunteers
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



exports.getPendingRequestsForVolunteer = async (req, res) => {
    try {
        const { volunteerUserId } = req.params;

        // Fetch pending requests for the volunteer
        const pendingRequests = await ConnectionRequest.find({
            volunteerUserId,
            status: 'pending'
        }).populate('disabledUserId', 'firstName lastName examName examVenue examDate');

        res.json({ pendingRequests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.respondToConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'accepted' or 'rejected'

        // Ensure status is valid
        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Update the connection request status
        const updatedRequest = await ConnectionRequest.findByIdAndUpdate(
            requestId,
            { status },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ error: 'Connection request not found' });
        }

        res.json({ message: `Request ${status} successfully`, updatedRequest });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

