const express = require("express");
const { registerExamRequest ,getExamDetail} = require("../controllers/disabledController");
const { validateExamRequest } = require("../middlewares/validation");
const { userAuth,isDisabledUser } = require("../middlewares/auth");

const disabledRoutes = express.Router();

// Route for disabled users to register an exam request with validation
disabledRoutes.post("/register-exam", userAuth,isDisabledUser, validateExamRequest, registerExamRequest);
disabledRoutes.get("/get-exam-details",userAuth,isDisabledUser,getExamDetail);
module.exports = disabledRoutes;

