const baseTemplate = require("./base");

/**
 * Generate password reset email HTML
 * @param {Object} options - Email options
 * @param {string} options.name - User's name
 * @param {string} options.resetUrl - Password reset URL
 * @returns {string} HTML email
 */

const passwordResetEmail = ({ name, resetUrl }) => {
  const content = `
    <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; line-height: 1.5;">Hello ${name || "there"},</p>
    <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">We received a request to reset your password for your Bien Unido Citizen App account. Please click the button below to reset your password:</p>
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin-top: 24px; margin-bottom: 24px;">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
            <tr>
              <td align="center" bgcolor="#1a73e8" style="border-radius: 4px;">
                <a href="${resetUrl}" target="_blank" style="border: none; color: #FFFFFF; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 12px 24px; text-decoration: none; text-align: center; mso-hide: all;">Reset Your Password</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin-top: 24px; margin-bottom: 16px; font-size: 16px; line-height: 1.5;">If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
    
    <p style="margin-top: 16px; margin-bottom: 16px; font-size: 14px; line-height: 1.5; color: #666666;">For security reasons, this password reset link will expire in 1 hour.</p>
    
    <p style="margin-top: 24px; margin-bottom: 0; font-size: 16px; line-height: 1.5;">Best regards,<br>The Bien Unido Citizen App Team</p>
    `;

  return baseTemplate({
    title: "Reset Your Password",
    content,
  });
};

module.exports = passwordResetEmail;
