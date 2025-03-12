const express = require("express");
const { registerVolunteer, validateVolunteerRegistration,validateVolunteerProfileUpdate,updateVolunteerProfile } = require("../controllers/volunteerController");
const { userAuth,isVolunteerUser } = require("../middlewares/auth");

const volunteerRoutes = express.Router();

volunteerRoutes.post("/register-volunteer", userAuth, isVolunteerUser,validateVolunteerRegistration, registerVolunteer);
volunteerRoutes.patch("/update-profile", userAuth, isVolunteerUser, validateVolunteerProfileUpdate, updateVolunteerProfile);
module.exports = volunteerRoutes;
