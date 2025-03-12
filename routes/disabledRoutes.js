const express = require("express");
const { registerExamRequest } = require("../controllers/disabledController");
const { validateExamRequest } = require("../middlewares/validation");
const { userAuth,isDisabledUser } = require("../middlewares/auth");

const disabledRoutes = express.Router();

// Route for disabled users to register an exam request with validation
disabledRoutes.post("/register-exam", userAuth,isDisabledUser, validateExamRequest, registerExamRequest);

module.exports = disabledRoutes;

