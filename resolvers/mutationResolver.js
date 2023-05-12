const authController = require("../controllers/authController.js");
const userController = require("../controllers/userController.js");

module.exports = {
  // Auth
  signupUser: authController.signup,
  loginUser: authController.login,
  forgetPassword: authController.forgetPassword,
  resetPassword: authController.resetPassword,
  updatePassword: authController.updatePassword,
  updateMe: userController.updateMe,
};
