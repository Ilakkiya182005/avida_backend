const ConnectionRequest = require('../models/ConnectionRequest');
const DisabledExamRequest = require('../models/DisabledExamRequest');
const VolunteerDetail = require('../models/VolunteerDetail');

exports.sendConnectionRequest = async (req, res) => {
    try {
        const { volunteerId } = req.params; // Changed from examRequestId to volunteerId

        if (req.user.userType !== "Disabled") {
            return res.status(403).json({ error: "Only disabled users can send connection requests" });
        }

        const disabledUserId = req.user._id;
        console.log("Fetching Volunteer for ID:", volunteerId);

        // Check if the volunteer exists
        const volunteer = await VolunteerDetail.findOne({ userId: volunteerId });
        if (!volunteer) {
            return res.status(404).json({ error: "Volunteer not found" });
        }
        console.log("Volunteer Details:", volunteer);

        // Check if a request already exists between this disabled user and the volunteer
        const existingRequest = await ConnectionRequest.findOne({
            disabledUserId,
            volunteerUserId: volunteerId,
            status: { $in: ["pending", "accepted"] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: "Request already sent to this volunteer" });
        }

        // Create a new connection request
        const connectionRequest = new ConnectionRequest({
            disabledUserId,
            volunteerUserId: volunteerId,
            status: "pending"
        });

        await connectionRequest.save();

        res.status(201).json({ message: "Connection request sent successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.respondToConnectionRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body; // 'accepted' or 'rejected'

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Find the connection request
        const request = await ConnectionRequest.findById(requestId)
            .populate("disabledUserId")
            .populate("volunteerUserId");

        if (!request) {
            return res.status(404).json({ error: 'Connection request not found' });
        }

        // ✅ Allow rejecting without affecting others
        if (status === 'rejected') {
            request.status = 'rejected';
            await request.save();
            return res.json({ message: 'Request rejected successfully', request });
        }

        // ✅ If accepted, reject only other pending requests
        if (status === 'accepted') {
            // Check if another request is already accepted
            const alreadyAccepted = await ConnectionRequest.findOne({
                disabledUserId: request.disabledUserId,
                status: 'accepted'
            });

            if (alreadyAccepted) {
                return res.status(400).json({ error: 'This request has already been accepted by another volunteer' });
            }

            // Reject all other pending requests for this disabled user
            await ConnectionRequest.updateMany(
                { disabledUserId: request.disabledUserId, status: 'pending', _id: { $ne: request._id } },
                { $set: { status: 'rejected' } }
            );

            // Get volunteer profile
            const volunteer = await VolunteerDetail.findOne({ userId: request.volunteerUserId._id });

            if (!volunteer) return res.status(404).json({ error: "Volunteer profile not found" });

            // Remove the booked examDate from the available_dates array
            volunteer.available_dates = volunteer.available_dates.filter(date => date !== request.disabledUserId.examDate);

            // Save updated volunteer profile
            await volunteer.save();
        }

        // Update the request status to accepted
        request.status = 'accepted';
        await request.save();

        res.json({ message: `Request ${status} successfully`, request });
    } catch (error) {
        console.error("Error processing connection request:", error);
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


exports.getRequestsForDisabledUser = async (req, res) => {
    try {
        const { disabledUserId } = req.params;

        // Fetch all connection requests made by this disabled user
        const requests = await ConnectionRequest.find({ disabledUserId })
            .populate({
                path: "volunteerUserId",
                select: "firstName lastName qualification city state"
            })
            .populate({
                path: "disabledUserId",
                select: "firstName lastName"
            });
            console.log({requests});

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
