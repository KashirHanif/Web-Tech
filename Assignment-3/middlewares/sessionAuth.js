//sets user variable for pug files
async function sessionAuth(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.isAdmin = false;
  if (req.session.user) {
    res.locals.isAdmin = Boolean(
      req.session.user.roles.find((r) => r == "admin")
    );
  } else req.session.user = null;
  //set flash function to req;
  //use req.flash("info","message") in router to set a flash message
  req.flash = function (type, message) {  // type will tell the type of message such as danger, success
    req.session.flash = { type, message };
  };
  //if flash message is set. set it to res.locals and clear it.
  if (req.session.flash) {
    res.locals.flash = req.session.flash;
    req.session.flash = null;
  }
  next();
}

module.exports = sessionAuth;

// if we save something in locals then data will be available to every middleware.It will be available to everyone who is coming through this view.
// if we need something again and again then place it in the middleware and wherever that middleware is used this data will be available such as req.flash.
// Application wide flash messaging. If we need message passing in a session.