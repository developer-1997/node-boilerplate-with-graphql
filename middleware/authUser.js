const { ForbiddenError } = require("apollo-server-core");
const errorHandler = require("../controllers/errorController");
const userModel = require("../models/userModel");
const { verifyJwt } = require("../utils/jwt.js");

const authUser = async (req) => {
  try {
    let access_token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      access_token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.access_token) {
      const { access_token: token } = req.cookies;
      access_token = token;
    }

    if (!access_token) return false;

    const decoded = verifyJwt(access_token, "JWT_ACCESS_PUBLIC_KEY");

    if (!decoded) return false;

    const session = decoded.user;
    if (!session) {
      throw new ForbiddenError("Session has expired");
    }

    const user = await userModel.findById(session).select("+verified");

    if (!user || !user.verified) {
      throw new ForbiddenError(
        "The user belonging to this token no logger exist"
      );
    }

    return user;
  } catch (error) {
    errorHandler(error);
  }
};

module.exports = authUser;
