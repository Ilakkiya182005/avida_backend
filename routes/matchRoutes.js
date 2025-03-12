const express = require('express');
const matchRoutes = express.Router();
const matchController = require('../controllers/disabledController');
const {userAuth}=require('../middlewares/auth');
// Find and connect matched volunteers for a disabled user
matchRoutes.post('/match-volunteers/:examRequestId',userAuth, matchController.findMatchingVolunteers);

module.exports = matchRoutes;
