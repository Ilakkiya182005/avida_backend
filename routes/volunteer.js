const express = require("express");
const { registerVolunteer, validateVolunteerRegistration,validateVolunteerProfileUpdate,updateVolunteerProfile,getUserProfile } = require("../controllers/volunteerController");
const { userAuth,isVolunteerUser } = require("../middlewares/auth");

const volunteerRoutes = express.Router();

volunteerRoutes.post("/register-volunteer", userAuth, isVolunteerUser,validateVolunteerRegistration, registerVolunteer);
volunteerRoutes.patch("/update-profile", userAuth, isVolunteerUser, validateVolunteerProfileUpdate, updateVolunteerProfile);
volunteerRoutes.get("/profile",userAuth,isVolunteerUser,getUserProfile)
module.exports = volunteerRoutes;
