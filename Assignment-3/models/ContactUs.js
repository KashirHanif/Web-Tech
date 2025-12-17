const mongoose = require("mongoose");
const contactUsSchema = mongoose.Schema({
  name: String,
  email: String,
  message: String,
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const ContactUs = mongoose.model("ContactUs", contactUsSchema);
module.exports = ContactUs;
