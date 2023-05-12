const jwt = require("jsonwebtoken");
const errorHandler = require("../controllers/errorController");

exports.signJwt = (payload, Key, options) => {
  const privateKey = Buffer.from(process.env[Key], "base64").toString("ascii");
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};

exports.verifyJwt = (token, Key) => {
  try {
    const publicKey = Buffer.from(process.env[Key], "base64").toString("ascii");
    const decoded = jwt.verify(token, publicKey);
    return decoded;
  } catch (error) {
    errorHandler(error);
  }
};
