const errorHandler = require("./errorController");
const checkIsLoggedIn = require("../middleware/checkIsLoggedIn");
const userModel = require("../models/userModel");

const getMe = async (_, args, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const user = await getAuthUser(req);

    return {
      status: "success",
      user,
    };
  } catch (error) {
    errorHandler(error);
  }
};

const updateMe = async (parent, { input: { name } }, { req, getAuthUser }) => {
  try {
    await checkIsLoggedIn(req, getAuthUser);

    const user = await getAuthUser(req);

    const filteredBody = {
      name,
    };

    let updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    return {
      status: "success",
      user: updatedUser,
    };
  } catch (error) {
    errorHandler(error);
  }
};

module.exports = {
  getMe,
  updateMe,
};
