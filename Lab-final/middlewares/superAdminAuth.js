// I have written this middleware to check whether the logged in user is admin or not.

module.exports = function (req, res, next) {
  // in this if condition below we are checking that if there 
  // is no user in the session the ask the user to login into 
  // the app using req.flash that will show message there and then we 
  // redirect the user to the login page.
  if (!req.session.user) {
    req.flash("danger", "Please login first");
    return res.redirect("/login");
  }

  // in this line below, we are checking whether the user in the 
  // session has the admin role added or not. if it is added then 
  // it will set the isAdmin to true otherwise false
  const isAdmin = req.session.user.roles.includes("admin");

  // if the user is not admin then show the user that access to you is denied
  // and redirect back to /
  if (!isAdmin) {
    req.flash("danger", "Access denied, Admins only can view this");
    return res.redirect("/");
  }

  // if the user is admin then isAdmin will be true and only then we will be 
  // able to reach here and then we will call next 
  next();
};
