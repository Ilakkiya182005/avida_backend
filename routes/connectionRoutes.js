const express = require('express');
const connectionRoutes = express.Router();
const connectionController = require('../controllers/connectionController');
const {userAuth,isVolunteerUser,isDisabledUser}=require('../middlewares/auth');

// Send a connection request
connectionRoutes.post("/send/:volunteerId", userAuth, isDisabledUser,connectionController.sendConnectionRequest);

// Get pending requests for a volunteer
connectionRoutes.get('/requests/:volunteerUserId', userAuth,isVolunteerUser,connectionController.getPendingRequestsForVolunteer);
connectionRoutes.get('/disabled-requests/:disabledUserId', userAuth, connectionController.getRequestsForDisabledUser);
connectionRoutes.get("/volunteer-requests/:volunteerUserId", userAuth, connectionController.getRequestsForVolunteer);
// Accept or reject a connection request
connectionRoutes.post('/respond/:requestId',userAuth, connectionController.respondToConnectionRequest);

connectionRoutes.get("/accepted-requests/:volunteerId", userAuth, connectionController.getAcceptedRequests);
module.exports = connectionRoutes;
