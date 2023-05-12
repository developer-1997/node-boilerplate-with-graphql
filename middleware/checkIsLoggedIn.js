const { AuthenticationError } = require("apollo-server-core");
const errorHandler = require("../controllers/errorController");

const checkIsLoggedIn = async (req, getAuthUser) => {
  try {
    const authUser = await getAuthUser(req);

    if (!authUser) {
      throw new AuthenticationError("You are not logged in");
    }
  } catch (error) {
    errorHandler(error);
  }
};

module.exports = checkIsLoggedIn;
