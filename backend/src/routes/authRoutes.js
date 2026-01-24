const express = require("express");
const router = express.Router();

const {
  registerLawyer,
} = require("../controllers/authController");

router.post("/register-lawyer", registerLawyer);

module.exports = router;
