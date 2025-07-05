const jwt = require("jsonwebtoken");

const refreshJWT = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  const sessionUser = req.session?.user;

  // 🔍 Log session state
  if (process.env.NODE_ENV !== "production") {
    console.log("🔍 Session User:", sessionUser);
  }

  // ✅ No token but session exists — generate new token
  if (!token) {
    if (sessionUser && sessionUser.uuid && sessionUser.email && sessionUser.role) {
      console.log("✅ Token missing but session is valid, regenerating token...");

      const tokenPayload = {
        uuid: sessionUser.uuid,
        email: sessionUser.email,
        role: sessionUser.role,
      };

      const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 2 * 60 * 60 * 1000,
        path: "/",
      });

      req.user = sessionUser;
      res.setHeader("X-Token-Refreshed", "true");
    }
    return next(); // Either regenerated or nothing to do
  }

  // ✅ Token exists — verify
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err && err.name === "TokenExpiredError") {
      console.warn("⚠️ JWT expired, checking session...");

      if (sessionUser && sessionUser.uuid && sessionUser.email && sessionUser.role) {
        console.log("✅ Session is active, refreshing JWT...");

        const tokenPayload = {
          uuid: sessionUser.uuid,
          email: sessionUser.email,
          role: sessionUser.role,
        };

        const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        res.cookie("token", newToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          maxAge: 2 * 60 * 60 * 1000,
          path: "/",
        });

        req.user = sessionUser;
        res.setHeader("X-Token-Refreshed", "true");
        return next();
      } else {
        console.warn("🔴 Session expired too, forcing re-login.");
        res.clearCookie("token");
        req.session.destroy(() => {
          return res.status(401).json({ message: "Session expired. Please log in again." });
        });
      }
    } else if (!err) {
      // ✅ Token valid
      req.user = decoded;
      return next();
    } else {
      // ❌ Invalid token (e.g. tampered)
      console.warn("🔴 Invalid token:", err.message);
      res.clearCookie("token");
      return res.status(401).json({ message: "Invalid token" });
    }
  });
};

module.exports = refreshJWT;
