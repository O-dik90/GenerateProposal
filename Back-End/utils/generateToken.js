require('dotenv').config();

const jwt = require("jsonwebtoken")
const moment = require("moment-timezone");

const ExpirationTime = moment().tz("Asia/Jakarta").add(2, 'hours').unix();
const VerifToken = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}
const TokenSetCookie = (res, user) => {
  console.log(`token: `, {...user, ExpirationTime});
  const token = jwt.sign({ ...user, exp: ExpirationTime }, process.env.JWT_SECRET);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: 'strict',
    maxAge: ExpirationTime,
  })

  return token;
}

module.exports = {
  ExpirationTime,
  VerifToken,
  TokenSetCookie
}