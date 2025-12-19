const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product")

router.post("/place-order", async (req, res) => {
  if (!req.session.user) {
    req.flash("error", "Please log in to place your order.");
    return res.redirect("/login");
  }
  const cart = req.cookies.cart || [];

  if (cart.length === 0) {
    req.flash("error", "Your cart is empty.");
    return res.redirect("/cart");
  }

  let products = await Product.find({ _id: { $in: cart } });
  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  await Order.create({
    userId: req.session.user._id,
    items: cart, 
    totalAmount: total
  });

  res.cookie("cart", []);

  req.flash("success", "Your order has been placed successfully!");
  return res.redirect("/cart");
});

router.get("/my-orders",  async (req, res) => {
  if(!req.session.user) {
    req.flash("error", "Please login to view your order")
    return res.redirect("/login");
  }
  const userId = req.session.user._id;
  const orders = await Order.find({ userId }).sort({ createdAt: -1 });
  for (let order of orders) {
    const products = await Product.find({ _id: { $in: order.items }});
    order.productDetails = products;
  }
  res.render("site/my-orders", { orders });
});

module.exports = router;
