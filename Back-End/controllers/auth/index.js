const { Users } = require("../../models/users");
const generate = require("../../utils/generateToken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email dan password harus ada" });
    }

    const user = await Users.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Kesalahan kredensial" });
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
        console.error("Gagal menyimpan sesi:", err);
        return res.status(500).json({ msg: "Sesi tidak tersimpan" });
      }

      console.log(`✅ Sesi tersimpan: ${req.sessionID}`);
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
    return res.status(500).json({ msg: "Kesalahan server" });
  }
};

const logOut = (req, res) => {
  if (!req.session) {
    return res.status(400).json({ msg: "Tidak ditemukan sesi sedang aktif" });
  }

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ msg: "Gagal keluar halaman" });
    }

    res.clearCookie("token", { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.clearCookie("connect.sid", { path: "/" });

    console.log(`✅ Sesi dihapus: ${req.sessionID}`);
    return res.status(200).json({ msg: "Berhasil keluar halaman" });
  });
};

module.exports = {
  login,
  logOut
};
