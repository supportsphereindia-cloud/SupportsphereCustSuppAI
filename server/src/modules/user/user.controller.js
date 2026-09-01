const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../shared/responses/ApiResponse");

const {
  getAllUsers,
} = require("./user.service");


/**
 * Get All Registered Users
 *
 * Returns all users currently registered
 * in SupportSphere.
 *
 * Password hashes are never returned.
 */
const getUsers = asyncHandler(
  async (req, res) => {
    const users =
      await getAllUsers();

    return res.status(200).json(
      new ApiResponse(
        200,
        "Users fetched successfully",
        users
      )
    );
  }
);


module.exports = {
  getUsers,
};

