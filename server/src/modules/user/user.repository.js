const prisma = require("../../config/prisma");


/**
 * Find all registered users.
 *
 * Used when displaying the list of
 * users registered in SupportSphere.
 *
 * Password hashes are intentionally
 * excluded from the response.
 */
const findAllUsers = async () => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};


/**
 * Find a user by email.
 *
 * Used when adding an existing user
 * to an organization.
 */
const findUserByEmail = async (
  email
) => {
  return prisma.user.findUnique({
    where: {
      email,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};


/**
 * Find a user by ID.
 */
const findUserById = async (
  userId
) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,
      name: true,
      email: true,
    },
  });
};


module.exports = {
  findAllUsers,
  findUserByEmail,
  findUserById,
};

