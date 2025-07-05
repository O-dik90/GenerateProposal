const express = require("express");
const { login, logOut } = require("../../controllers/auth");
const refreshJWT = require("../../middlewares/refresh-jwt");
const router = express.Router();

router.post('/login', login);
router.delete('/logout', logOut);
router.get('/refresh-token', refreshJWT, (req, res) => {
  if (req.user) {
    return res.json({
      uuid: req.session.user.uuid,
      name: req.session.user.name,
      role: req.session.user.role,
      token: req.cookies.token
    });
  }
  return res.status(401).json({ message: "Sesi tidak valid" });
});

module.exports = router 