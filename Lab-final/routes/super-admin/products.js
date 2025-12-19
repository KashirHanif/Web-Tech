const express = require("express");
let Product = require("../../models/Product");
let router = express.Router();
const multer = require("multer");
const path = require("path");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/uploaded");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// GET - render create form
router.get("/products/create", (req, res) => {
  res.render("super-admin/products/create");
});

// POST - handle form submission
router.post("/products/create", upload.single("image"), async (req, res) => {
  try {
    const { name, price, color, department, description } = req.body;// get details that user has added in the req.body
    const image = req.file ? req.file.filename : null;

    const newProduct = new Product({ // creating new product
      name,
      price,
      color,
      department,
      description,
      image,
    });

    await newProduct.save();// saving new product to the database.
    res.redirect("/super-admin/products"); //redirect from create to products page back
  } catch (err) { // handles error 
    console.error("Error creating product:", err);
    res.status(500).send("Failed to create product");
  }
});
router.get("/products/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id); // get the id from params and find that user from the product collection and return it. 
    res.redirect("/super-admin/products");// redirect back to products page
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).send("Failed to delete product");
  }
});
// getting the product id from the params and then delete it
router.get("/products/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");

    res.render("super-admin/products/edit", { product });
  } catch (err) {
    console.error("Error fetching product for edit:", err);
    res.status(500).send("Internal Server Error");
  }
});

// POST - update product
router.post("/products/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, color, department, description } = req.body;
    const updateData = { name, price, color, department, description };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/super-admin/products");
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).send("Failed to update product");
  }
});
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("super-admin/products/list", { products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).send("Internal Server Error");
  }
});
module.exports = router;
