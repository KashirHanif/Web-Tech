var express = require("express");
var router = express.Router();
var Category = require("../../models/Category");

function generateSlug(name) {
  return name.toLowerCase().trim().replace(/ /g, "-");
}

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.render("super-admin/categories/list", { categories });
});

router.get("/create", (req, res) => {
  res.render("super-admin/categories/create");
});

router.post("/create", async (req, res) => {
  const { name, description } = req.body;

  await Category.create({
    name,
    description,
    slug: generateSlug(name)
  });

  req.flash("success", "Category created successfully!");
  res.redirect("/super-admin/categories");
});

router.get("/edit/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render("super-admin/categories/edit", { category });
});


router.post("/edit/:id", async (req, res) => {
  const { name, description } = req.body;

  const category = await Category.findById(req.params.id);
  category.name = name;
  category.description = description;
  category.slug = generateSlug(name);

  await category.save();
  req.flash("success", "Category updated successfully!");
  res.redirect("/super-admin/categories");
});


router.get("/delete/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  req.flash("success", "Category deleted successfully!");
  res.redirect("/super-admin/categories");
});

module.exports = router;
