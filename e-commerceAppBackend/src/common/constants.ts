export const ERROR_MESSAGE = {
  default: 'Internal Server Error',
  badRequest: 'Bad Request Provided!',
  forbiddenRequest: 'Forbidden! Not permitted user to do operation provided',
  unauthorizedRequest: 'Unauthorized! Invalid or no token provided',
  userExists: 'User Exists!',
  userDoesNotExists: 'User does not exists!',
  invalidCredentials: 'Invalid Credentials!',
};

export const RESPONSE_MESSAGE = {
  newPasswordEmailSubject: 'Create New Password',
  newAccountEmailSubject: 'Account Creation Successful! ✌',
  changedPasswordEmailSubject: 'New Password Successfully Updated! 😃',
  orderPlacedEmailSubject: 'Thanks for shopping at HappyShop! 🎁',
  mailSendSuccessMessage: 'Mail has been Send Successfully',
  mailSendFailureMessage: 'Mail could not send',
};

export const CONSTANTS = {
  ITEMS_PER_PAGE: 3,
  DEFAULT_PAGE: 1,
  PASSWORD_SALT: 12,
  CRYPTO_BYTE_SIZE: 32,
};
