const jwt = require("jsonwebtoken");

const refreshJWT = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err && err.name === "TokenExpiredError") {
      console.warn("⚠️ JWT expired, checking session...");

      if (req.session.user) {
        console.log("✅ Session is active, refreshing JWT...");
        
        const tokenPayload = {
          uuid: req.session.user.uuid,
          email: req.session.user.email,
          role: req.session.user.role,
        };

        const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "2h" });

        res.cookie("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV !== "development",
          maxAge: 2 * 60 * 60 * 1000,
        });

        req.user = req.session.user; // Attach user to request

        return res.json({ message: "JWT refreshed successfully", token: newToken });
      } else {
        console.warn("🔴 Session expired too, forcing re-login.");
        res.clearCookie("token");
        req.session.destroy();
        return res.status(401).json({ message: "Session expired. Please log in again." });
      }
    } else if (!err) {
      req.user = decoded; // Attach user if JWT is still valid
    }

    next();
  });
};

module.exports = refreshJWT;
