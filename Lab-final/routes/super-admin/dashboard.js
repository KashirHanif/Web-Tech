const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const User = require("../../models/User");
const ContactUs = require("../../models/ContactUs");
const Order = require("../../models/Order")

router.get("/", async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const totalCategories = await Category.countDocuments();
  const totalUsers = await User.countDocuments({ roles: { $ne: "admin" } });

  const complaints = await ContactUs.find({ isResolved: false })
    .sort({ createdAt: -1 });

  const orders = await Order.find()
    .populate("userId", "name email")
    .sort({ createdAt: -1 });

  res.render("super-admin/dashboard", {
    totalProducts,
    totalCategories,
    totalUsers,
    orders,
    complaints
  });
});

module.exports = router;
