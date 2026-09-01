const ApiError = require("../../shared/errors/ApiError");

const {
  findAllUsers,
  findUserByEmail,
  findUserById,
} = require("./user.repository");


/**
 * Get All Registered Users
 *
 * Returns all users registered in
 * SupportSphere.
 */
const getAllUsers = async () => {
  return findAllUsers();
};


/**
 * Find User By Email
 *
 * Used internally when adding an existing
 * user to an organization.
 */
const getUserByEmail = async (
  email
) => {
  const user = await findUserByEmail(
    email
  );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return user;
};


/**
 * Find User By ID
 */
const getUserById = async (
  userId
) => {
  const user = await findUserById(
    userId
  );

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  return user;
};


module.exports = {
  getAllUsers,
  getUserByEmail,
  getUserById,
};