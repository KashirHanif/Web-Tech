var express = require("express");
var router = express.Router();
var Product = require("../models/Product");
const Category = require("../models/Category");
router.get("/cart", async function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  let products = await Product.find({ _id: { $in: cart } });

  let total = products.reduce(
    (total, product) => total + Number(product.price),
    0
  );

  res.render("site/cart", { products, total });
});
router.get("/add-cart/:id", function (req, res, next) {
  let cart = req.cookies.cart;
  if (!cart) cart = [];
  cart.push(req.params.id);
  res.cookie("cart", cart);
  req.flash("success", "Product Added To Cart");
  res.redirect("/");
});

router.get("/cart/remove/:id", (req, res) => {
  let cart = req.cookies.cart || [];
  const id = req.params.id;
  cart = cart.filter(item => item !== id);
  res.cookie("cart", cart);
  res.redirect("/cart");
});

router.get("/cart/clear", (req, res) => {
  res.cookie("cart", []);
  res.redirect("/cart");
});

router.get("/category/:slug/:page?", async (req, res) => {
  const { slug } = req.params;
  const page = Number(req.params.page) || 1;
  const pageSize = 9;
  const skip = (page - 1) * pageSize;

  const category = await Category.findOne({ slug });
  if (!category) return res.status(404).send("Category not found");

  const departmentQuery = new RegExp("^" + slug.replace(/-/g, " ") + "$", "i");

  const products = await Product.find({ department: departmentQuery })
                                .skip(skip)
                                .limit(pageSize);

  const totalProducts = await Product.countDocuments({ department: departmentQuery });
  const totalPages = Math.ceil(totalProducts / pageSize);

  const categories = await Category.find();

  res.render("site/homepage", {
    pagetitle: category.name,
    products,
    page,
    totalPages,
    categories,
    activeCategory: slug
  });
});


router.get("/:page?", async (req, res) => {
  let page = Number(req.params.page) || 1;
  let pageSize = 9;
  let skip = (page - 1) * pageSize;

  let products = await Product.find().skip(skip).limit(pageSize);
  let totalProducts = await Product.countDocuments();
  let totalPages = Math.ceil(totalProducts / pageSize);

  let categories = await Category.find();

  return res.render("site/homepage", {
    pagetitle: "Awesome Products",
    products,
    page,
    totalPages,
    categories,
    activeCategory: null
  });
});


module.exports = router;
