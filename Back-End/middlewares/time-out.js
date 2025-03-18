autoLogoutMiddleware = (req, res, next) => {
  if (!req.session) return next();

  const now = Date.now();
  const sessionExpiry = req.session.cookie.expires ? new Date(req.session.cookie.expires) : null;

  if (sessionExpiry && sessionExpiry < now) {
    req.session.destroy((err) => {
      if (err) console.error("❌ Error destroying expired session:", err);
      res.clearCookie("connect.sid"); // ✅ Remove session cookie
      return res.status(401).json({ message: "Session expired, please log in again." });
    });
  } else {
    next();
  }
};

module.exports = {
  autoLogoutMiddleware
}