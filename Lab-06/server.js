const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.get("/", (req, res) => {
    res.render("homepage");
})

app.get("/contact-us", (req,res) => {
    res.render("contact-us");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})