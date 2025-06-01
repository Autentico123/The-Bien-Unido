const baseTemplate = require("./base");

/**
 * Generate verification email HTML
 * @param {Object} options - Email options
 * @param {string} options.name - User's name
 * @param {string} options.verificationCode - Verification code
 * @returns {string} HTML email
 */
const verificationEmail = ({ name, verificationCode }) => {
  const content = `
    <p style="margin-top: 0; margin-bottom: 16px; font-size: 16px; line-height: 1.5;">Hello ${name || "there"},</p>
    <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.5;">Thank you for registering with the Bien Unido Citizen App. To complete your registration, please use the verification code below:</p>
    
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
      <tr>
        <td align="center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="80%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #F5F5F5; border-radius: 4px;">
            <tr>
              <td align="center" style="padding: 20px 10px;">
                <div style="font-size: 28px; letter-spacing: 5px; font-weight: bold; color: #333333;">${verificationCode}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin-top: 24px; margin-bottom: 16px; font-size: 16px; line-height: 1.5;">This code will expire in 15 minutes. If you did not request this verification, please ignore this email.</p>
    
    <p style="margin-top: 24px; margin-bottom: 0; font-size: 16px; line-height: 1.5;">Best regards,<br>The Bien Unido Citizen App Team</p>
  `;

  return baseTemplate({
    title: "Verify Your Email Address",
    content,
  });
};

module.exports = verificationEmail;
