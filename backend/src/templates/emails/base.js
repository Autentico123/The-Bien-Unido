/**
 * Base email template
 * @param {Object} options - Template options
 * @param {string} options.title - Email title
 * @param {string} options.content - Main email content (can be HTML)
 * @param {string} options.buttonText - Optional CTA button text
 * @param {string} options.buttonUrl - Optional CTA button URL
 * @returns {string} HTML email template
 */
const baseTemplate = ({ title, content, buttonText, buttonUrl }) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title || "Bien Unido Citizen App"}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px; line-height: 1.5; color: #333333; background-color: #F9F9F9; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
        <tr>
          <td align="center" style="padding: 20px 0;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; border-radius: 8px; box-shadow: 0 3px 6px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td align="center" bgcolor="#1a73e8" style="padding: 24px 20px; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #FFFFFF; margin: 0; padding: 0; font-size: 24px; font-weight: 700;">Bien Unido Citizen App</h1>
                </td>
              </tr>
              <!-- Content -->
              <tr>
                <td style="padding: 30px 30px 20px 30px;">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                    <tr>
                      <td>
                        <h2 style="margin-top: 0; margin-bottom: 20px; color: #333333; font-size: 20px; font-weight: 600;">${title || ""}</h2>
                        ${content || ""}
                        
                        ${
                          buttonText && buttonUrl
                            ? `
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; margin-top: 30px;">
                          <tr>
                            <td align="center">
                              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                <tr>
                                  <td align="center" bgcolor="#1a73e8" style="border-radius: 4px;">
                                    <a href="${buttonUrl}" target="_blank" style="border: none; color: #FFFFFF; display: inline-block; font-size: 16px; font-weight: bold; line-height: 1.2; padding: 12px 24px; text-decoration: none; text-align: center; mso-hide: all;">${buttonText}</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        `
                            : ""
                        }
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding: 20px 30px 30px 30px; text-align: center; font-size: 12px; color: #666666; border-top: 1px solid #EEEEEE;">
                  <p style="margin: 0; padding: 0;">&copy; ${new Date().getFullYear()} Bien Unido Citizen App. All rights reserved.</p>
                  <p style="margin: 10px 0 0; padding: 0;">This is an automated message, please do not reply directly to this email.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

module.exports = baseTemplate;
