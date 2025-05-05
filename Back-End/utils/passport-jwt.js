require("dotenv").config();
const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const { Users } = require("../models/users");
const moment = require("moment-timezone");

// Extract JWT from cookies or Authorization header
const cookieExtractor = (req) => {
  console.log("Cookies received:", req.cookies);
  return req?.cookies?.token || null;
};

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([
    cookieExtractor,
    ExtractJwt.fromAuthHeaderAsBearerToken(),
  ]),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new Strategy(opts, async (payload, done) => {
    try {
      const expTimeJakarta = moment.unix(payload.exp).tz("Asia/Jakarta").format('YYYY-MM-DD HH:mm:ss');
      console.log("❌ Exp:", expTimeJakarta + '\n');

      // Explicitly check if JWT is expired
      if (payload.exp * 1000 < Date.now()) {
        console.log("JWT token expired.");
        return done(null, false);
      }

      console.log("payload:", payload);
      const user = await Users.findOne({ where: { uuid: payload.uuid  } });
      if (!user) {
        console.log("Pengguna tidak ditemukan.");
        return done(null, false);
      }

      console.log("User authenticated:", user.uuid);
      return done(null, user);
    } catch (error) {
      console.error(
        "Passport authentication error:",
        process.env.NODE_ENV === "development" ? error.stack : error.message
      );
      return done(error, false);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.uuid);
});

passport.deserializeUser(async (uuid, done) => {
  try {
    const user = await Users.findOne({ where: { uuid } });
    if (!user) return done(null, false);
    return done(null, user);
  } catch (error) {
    console.error("Deserialization error:", error.message);
    return done(error, false);
  }
});

module.exports = passport;
