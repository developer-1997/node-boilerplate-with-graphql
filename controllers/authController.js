const { AuthenticationError, ForbiddenError } = require("apollo-server-core");
const { GraphQLError } = require("graphql");
const userModel = require("../models/userModel");
const { signJwt, verifyJwt } = require("../utils/jwt");
const errorHandler = require("./errorController");
const accessTokenExpireIn = process.env.JWT_ACCESS_TOKEN_EXPIRES_IN ?? 60;
const refreshTokenExpireIn = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN ?? 60;
const dotenv = require("dotenv");
const crypto = require("crypto");
const checkIsLoggedIn = require("../middleware/checkIsLoggedIn");
const sendEmail = require("./../utils/email");

dotenv.config();

const cookieOptions = {
  httpOnly: true,
  // domain: 'localhost',
  sameSite: "none",
  secure: true,
};

const accessTokenCookieOptions = {
  ...cookieOptions,
  maxAge: accessTokenExpireIn * 60 * 1000,
  expires: new Date(Date.now() + accessTokenExpireIn * 60 * 1000),
};

const refreshTokenCookieOptions = {
  ...cookieOptions,
  maxAge: refreshTokenExpireIn * 60 * 1000,
  expires: new Date(Date.now() + refreshTokenExpireIn * 60 * 1000),
};

if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

async function signTokens(user, req) {
  req.user = user;
  console.log(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN);
  const access_token = signJwt({ user: user.id }, "JWT_ACCESS_PRIVATE_KEY", {
    expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRES_IN}m`,
  });

  const refresh_token = signJwt({ user: user.id }, "JWT_REFRESH_PRIVATE_KEY", {
    expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRES_IN}m`,
  });

  return { access_token, refresh_token };
}

exports.signup = async (
  parent,
  { input: { name, email, password, passwordConfirm } },
  { req }
) => {
  try {
    const user = await userModel.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    return {
      status: "success",
      user,
    };
  } catch (error) {
    if (error.code === 11000) {
      throw new ForbiddenError("User already exist");
    }
    errorHandler(error);
  }
};

exports.login = async (
  parent,
  { input: { email, password } },
  { req, res }
) => {
  try {
    const user = await userModel
      .findOne({ email })
      .select("+password +verified");

    if (!user || !(await user.comparePasswords(password, user.password))) {
      throw new AuthenticationError("Invalid email or password");
    }

    user.password = undefined;

    const { access_token, refresh_token } = await signTokens(user, req);

    res.cookie("refresh_token", refresh_token, refreshTokenCookieOptions);
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return {
      status: "success",
      access_token,
    };
  } catch (error) {
    errorHandler(error);
  }
};

exports.forgetPassword = async (parent, { input: { email } }, { req, res }) => {
  const user = await userModel.findOne({ email });

  if (!user) {
    throw new GraphQLError("User not found.", {
      extensions: {
        code: 404,
      },
    });
  }

  const resetToken = user.createPasswordResetToken();

  const resetUrl = `http://localhost:3000/forgotPassword?token=${resetToken}`;

  const message = `Forget your password?Submit a patch request with new password and passwordConfirm to: ${resetUrl}.\n If you don't forget password then please ignore email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token",
      message,
    });

    await user.save({
      validateBeforeSave: false,
    });

    return {
      status: "success",
      resetToken,
    };
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });
    throw new GraphQLError("There was an error in sending emails.", {
      extensions: {
        code: 404,
      },
    });
  }
};

exports.resetPassword = async (
  parent,
  { input: { password, passwordConfirm, token } },
  { req, res }
) => {
  if (password !== passwordConfirm) {
    throw new Error(`Your passwords don't match`);
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await userModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired");
  }

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return {
    status: "success",
  };
};

exports.updatePassword = async (
  parent,
  { input: { oldPassword, password, passwordConfirm } },
  { req, getAuthUser }
) => {
  await checkIsLoggedIn(req, getAuthUser);

  const storeUser = await getAuthUser(req);

  const user = await userModel.findOne(storeUser._id).select("+password");

  // 2) check if posted current password is correct
  if (
    !oldPassword ||
    !(await user.correctPassword(oldPassword, user.password))
  ) {
    throw new Error(`password is incorrect`);
  }

  // 3) if so , update password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  const { access_token, refresh_token } = await signTokens(user, req);

  return {
    status: "success",
    access_token: access_token,
  };
};

exports.refreshAccessToken = async (parent, args, { req, res }) => {
  try {
    // Get the refresh token
    const { refresh_token } = req.cookies;

    // Validate the RefreshToken
    const decoded = verifyJwt(refresh_token, "JWT_REFRESH_PUBLIC_KEY");

    if (!decoded) {
      throw new ForbiddenError("Could not refresh access token");
    }

    // Check if user's session is valid
    const session = await redisClient.get(decoded.user);

    if (!session) {
      throw new ForbiddenError("User session has expired");
    }

    // Check if user exist and is verified
    const user = await userModel
      .findById(JSON.parse(session)._id)
      .select("+verified");

    if (!user || !user.verified) {
      throw new ForbiddenError("Could not refresh access token");
    }

    // Sign new access token
    const access_token = signJwt({ user: user._id }, "JWT_ACCESS_PRIVATE_KEY", {
      expiresIn: config.get("jwtAccessTokenExpiresIn"),
    });

    // Send access token cookie
    res.cookie("access_token", access_token, accessTokenCookieOptions);
    res.cookie("logged_in", "true", {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    return {
      status: "success",
      access_token,
    };
  } catch (error) {
    errorHandler(error);
  }
};

exports.logoutHandler = async (_, args, { req, res, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const user = await getAuthUser(req);

    res.cookie("access_token", "", { maxAge: -1 });
    res.cookie("refresh_token", "", { maxAge: -1 });
    res.cookie("logged_in", "", { maxAge: -1 });

    return true;
  } catch (error) {
    errorHandler(error);
  }
};
