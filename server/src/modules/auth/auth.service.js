const bcrypt = require("bcrypt");

const ApiError = require("../../shared/errors/ApiError");

const {
  generateAccessToken,
} = require("../../utils/jwt");

const {
  findUserByEmail,
  findUserById,
  createUser,
} = require("./auth.repository");

const AUTH_MESSAGES = require("./auth.constants");

/**
 * Register User
 *
 * Creates a user without automatically assigning
 * an organization.
 *
 * Organization membership will be handled separately
 * through the organization/RBAC layer.
 */
const registerUser = async ({
  name,
  email,
  password,
}) => {
  const existingUser =
    await findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(
      409,
      AUTH_MESSAGES.EMAIL_ALREADY_EXISTS
    );
  }

  const passwordHash =
    await bcrypt.hash(
      password,
      10
    );

  const user = await createUser({
    name,
    email,
    passwordHash,
  });

  const {
    passwordHash: _,
    memberships,
    ...safeUser
  } = user;

  return {
    ...safeUser,
    memberships: memberships || [],
  };
};


/**
 * Login User
 *
 * Returns the authenticated user's
 * organization memberships and roles.
 */
const loginUser = async ({
  email,
  password,
}) => {
  // Find user
  const user =
    await findUserByEmail(email);

  if (!user) {
    throw new ApiError(
      401,
      AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }


  // Compare password
  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.passwordHash
    );

  if (!isPasswordValid) {
    throw new ApiError(
      401,
      AUTH_MESSAGES.INVALID_CREDENTIALS
    );
  }


  /*
   * Organization memberships
   *
   * A user may currently have:
   *
   * - No organization
   * - One organization
   * - Multiple organizations
   *
   * We return all memberships instead
   * of assuming a single organization.
   */
  const memberships =
    user.memberships || [];


  /*
   * Generate JWT
   *
   * We currently keep the JWT minimal.
   *
   * Organization and role information is
   * retrieved from the database rather than
   * permanently embedding it into the token.
   */
  const accessToken =
    generateAccessToken({
      id: user.id,
      email: user.email,
    });


  // Remove sensitive information
  const {
    passwordHash: _,
    memberships: userMemberships,
    ...safeUser
  } = user;


  return {
    user: {
      ...safeUser,

      memberships:
        userMemberships || [],
    },

    accessToken,
  };
};


/**
 * Get Current Authenticated User
 *
 * Returns the user along with their
 * organization memberships and roles.
 */
const getCurrentUser = async (
  userId
) => {
  const user =
    await findUserById(userId);

  if (!user) {
    throw new ApiError(
      401,
      AUTH_MESSAGES.UNAUTHORIZED
    );
  }

  return user;
};


module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};