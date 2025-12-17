module.exports = function (req, res, next) {
  if (!req.session.user) {
    req.flash("danger", "Please login first");
    return res.redirect("/login");
  }

  const isAdmin = req.session.user.roles.includes("admin");

  if (!isAdmin) {
    req.flash("danger", "Access denied, Admins only can view this");
    return res.redirect("/");
  }

  next();
};
