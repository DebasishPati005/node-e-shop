"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONSTANTS = exports.RESPONSE_MESSAGE = exports.ERROR_MESSAGE = void 0;
exports.ERROR_MESSAGE = {
    default: 'Internal Server Error',
    badRequest: 'Bad Request Provided!',
    forbiddenRequest: 'Forbidden! Not permitted user to do operation provided',
    unauthorizedRequest: 'Unauthorized! Invalid or no token provided',
    userExists: 'User Exists!',
    userDoesNotExists: 'User does not exists!',
    invalidCredentials: 'Invalid Credentials!',
};
exports.RESPONSE_MESSAGE = {
    newPasswordEmailSubject: 'Create New Password',
    newAccountEmailSubject: 'Account Creation Successful! ✌',
    changedPasswordEmailSubject: 'New Password Successfully Updated! 😃',
    orderPlacedEmailSubject: 'Thanks for shopping at HappyShop! 🎁',
    mailSendSuccessMessage: 'Mail has been Send Successfully',
    mailSendFailureMessage: 'Mail could not send',
};
exports.CONSTANTS = {
    ITEMS_PER_PAGE: 3,
    DEFAULT_PAGE: 1,
    PASSWORD_SALT: 12,
    CRYPTO_BYTE_SIZE: 32,
};
