const { Users } = require("../../models/users");
const generate = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required." });
    }

    const user = await Users.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    // 🔥 Store user session (24 hours)
    req.session.user = {
      uuid: user.uuid,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ msg: "Session could not be saved" });
      }

      console.log(`✅ Session saved: ${req.sessionID}`);
      const tokenPayload = {
        uuid: user.uuid,
        name: user.name,
        role: user.role,
      };
      const token = generate.TokenSetCookie(res, tokenPayload);

      return res.status(200).json({
        uuid: user.uuid,
        name: user.name,
        role: user.role,
        token: token,
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};



const logOut = (req, res) => {
  if (!req.session) {
    return res.status(400).json({ msg: "No active session found" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ msg: "Logout failed" });
    }

    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.clearCookie("connect.sid", { path: "/" });

    console.log(`✅ Session Destroyed: ${req.sessionID}`);
    return res.status(200).json({ msg: "Successfully logged out" });
  });
};

module.exports = {
  login,
  logOut
};
