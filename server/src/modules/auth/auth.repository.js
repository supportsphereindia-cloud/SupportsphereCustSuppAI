const prisma = require("../../config/prisma");

/**
 * Find a user by email.
 *
 * Includes organization memberships so the authenticated
 * user's organization and role can be determined.
 *
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
const findUserByEmail = async (email) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      memberships: {
        include: {
          organization: true,
        },
      },
    },
  });
};

/**
 * Find a user by ID.
 *
 * Includes organization memberships and organization
 * details for the authenticated user.
 *
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
const findUserById = async (id) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,

      memberships: {
        select: {
          id: true,
          role: true,
          organizationId: true,

          organization: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },

          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
};

/**
 * Create a new user.
 *
 * @param {Object} userData
 * @returns {Promise<Object>}
 */
const createUser = async (userData) => {
  return prisma.user.create({
    data: userData,
  });
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
};