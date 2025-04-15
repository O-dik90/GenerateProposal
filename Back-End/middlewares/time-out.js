const autoLogoutMiddleware = (req, res, next) => {
  if (!req.session) return next();

  const now = Date.now();
  const sessionExpiry = req.session.cookie._expires 
    ? new Date(req.session.cookie._expires) 
    : null;

  if (sessionExpiry && sessionExpiry < now) {
    console.warn("🕑 Session expired, destroying...");

    req.session.destroy((err) => {
      if (err) console.error("❌ Error destroying expired session:", err);
      res.clearCookie("connect.sid");
      res.clearCookie("token");
      return res.status(401).json({ message: "Session expired. Please log in again." });
    });
  } else {
    next();
  }
};

module.exports = {
  autoLogoutMiddleware
};
