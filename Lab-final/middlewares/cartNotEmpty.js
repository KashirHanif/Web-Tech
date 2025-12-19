async function cartNotEmpty (req, res, next) {
    const cart = req.cookie.cart || [];
    if(cart.length === 0) {
        req.flash("error", "Your cart is empty so please place some products.")
        return res.redirect("/");
    }
    next();
}