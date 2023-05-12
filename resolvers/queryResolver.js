const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

module.exports = {
  // Users
  getMe: userController.getMe,
  // Auth
  refreshAccessToken: authController.refreshAccessToken,
  logoutUser: authController.logoutHandler,
};
