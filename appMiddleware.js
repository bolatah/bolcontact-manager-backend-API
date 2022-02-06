// User is not authenticated
function isNotAuth(req, res, next) {
  if (req.session.isAuth) {
    next();
  } else {
    res.status(401).render("401");
  }
}

// User is authenticated
function isAuth(req, res, next) {
  if (req.session.isAuth) {
    res.redirect("/");
  } else {
    next();
  }
}

// Current user
function currentUser(req, res, next) {
  if (req.session.username) {
    res.locals.username = req.session.username;
    next();
  } else {
    res.locals.username = null;
    next();
  }
}

module.exports = { isNotAuth, isAuth, currentUser };
