const express = require("express");
const router = express.Router();
const ContactUs = require("../../models/ContactUs");

router.get("/resolve/:id", async (req, res) => {
  const item = await ContactUs.findById(req.params.id);

  if (!item) return res.status(404).send("Complaint not found");

  item.isResolved = true;
  await item.save();

  res.redirect("/super-admin");
});

module.exports = router;
