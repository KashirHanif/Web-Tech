const express = require("express");
const router = express.Router();
const ContactUs = require("../models/ContactUs");
const User = require("../models/User");

router.post("/submit-message", async (req, res) => {
  const { name, email, message } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists) {
    req.flash("error", "Invalid email. No user found with this email address.");
    return res.redirect("back");
  }

  await ContactUs.create({
    name,
    email,
    message
  });

  req.flash("success", "Your complaint has been submitted successfully!");
  res.redirect("back");
});

module.exports = router;
