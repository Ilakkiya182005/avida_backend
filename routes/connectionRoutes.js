const express = require('express');
const connectionRoutes = express.Router();
const connectionController = require('../controllers/connectionController');
const {userAuth,isVolunteerUser,isDisabledUser}=require('../middlewares/auth');

// Send a connection request
connectionRoutes.post("/send/:examRequestId", userAuth, isDisabledUser,connectionController.sendConnectionRequest);

// Get pending requests for a volunteer
connectionRoutes.get('/requests/:volunteerUserId', userAuth,isVolunteerUser,connectionController.getPendingRequestsForVolunteer);

// Accept or reject a connection request
connectionRoutes.patch('/respond/:requestId',userAuth, connectionController.respondToConnectionRequest);

module.exports = connectionRoutes;
