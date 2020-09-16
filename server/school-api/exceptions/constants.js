/*
 * ========================================
 * GENERIC ERRORS
 * Code 11XX
 * ========================================
 */
export const UNAUTHORIZED_EXCEPTION = {
  code: 1100,
  message: 'Sign in, please',
};

export const USER_DOES_NOT_EXIST = {
  code: 1102,
  message: 'The user doesn\'t exist',
};

export const USER_NOT_ADMIN = {
  code: 1103,
  message: 'Move along, there is nothing to see here',
};

export const USER_NOT_ENOUGH_PERMISSIONS = {
  code: 1104,
  message: 'You don\'t enough permissions to request this action',
};

export const SIGN_IN_INVALID_CREDENTIALS = {
  code: 1105,
  message: 'Invalid credentials.',
};
