/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {boolean} - Whether password meets requirements
 */

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates Philippine mobile number
 * @param {string} mobile - The mobile number to validate
 * @returns {boolean} - Whether mobile number is valid
 */
const validatePhMobile = (mobile) => {
  // Format: +639XXXXXXXXX or 09XXXXXXXXX
  const mobileRegex = /^(\+?63|0)?[0-9]{10}$/;
  return mobileRegex.test(mobile);
};

/**
 * Validates email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether email is valid
 */
const validateEmail = (email) => {
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

module.exports = {
  validatePassword,
  validatePhMobile,
  validateEmail,
};
