const express = require("express");
const router = express.Router();
const Order = require("../../models/Order");

router.post("/update-status/:id", async (req, res) => {
  const { status } = req.body;
  await Order.findByIdAndUpdate(req.params.id, {
    status
  });

  req.flash("success", "Order status updated!");
  res.redirect("/super-admin");
});

module.exports = router;
