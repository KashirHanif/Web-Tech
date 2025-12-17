const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose")
const ProductModel = require("./product.model");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());
app.set("view engine", "ejs");
app.use(expressLayouts);

mongoose.connect("mongodb://127.0.0.1:27017/productsDb", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
}
);

app.get("/api/products/:id", async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.json(product);
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching product", error });
    }
    
})
app.delete("/api/products/:id", async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id);
        res.json(product);
    }
    catch(error) {
        res.status(500).json({ message: "Error deleting products", error });
    }
    
})
app.put("/api/products/:id", async (req, res) => {
    try {
        let product = await ProductModel.findById(req.params.id);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        await product.save();
        res.json(product);
    }
    catch(error) {
        res.status(500).json({ message: "Error updating products", error });
    }
    
})
app.post("/api/products", async (req, res) => {
    try {
        const data = req.body;
        const product = new ProductModel(data);
        await product.save();
        res.json(product);
    }
    catch(error) {
        res.status(500).json({ message: "Error creating products", error });
    }
    
})

app.get("/api/products", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    }
    catch(error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
    
})

app.get("/", (req, res) => {
    res.render("homepage");
})

app.get("/contact-us", (req,res) => {
    res.render("contact-us");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})