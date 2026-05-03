const emailTemplates = {
  // Careers: applicant confirmation (optional)
  jobApplicationConfirmation: (applicantName, jobTitle, jobUrl) => ({
    subject: `Application received – ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 22px;">Application Received</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 28px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 16px;">Dear ${applicantName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
            Thank you for applying for <strong>${jobTitle}</strong>. We’ve received your application and our team will review it shortly.
          </p>
          ${
            jobUrl
              ? `<p style="font-size: 14px; line-height: 1.6; margin-bottom: 18px;">
                   Job link: <a href="${jobUrl}" target="_blank" rel="noopener noreferrer">${jobUrl}</a>
                 </p>`
              : ""
          }
          <p style="font-size: 14px; line-height: 1.6;">
            If your profile matches our requirements, we’ll reach out via email.
          </p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 26px;">
            Com Financial Services Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${applicantName},\n\nThank you for applying for ${jobTitle}. We’ve received your application and our team will review it shortly.\n\n${
      jobUrl ? `Job link: ${jobUrl}\n\n` : ""
    }If your profile matches our requirements, we’ll reach out via email.\n\nCom Financial Services Team`,
  }),

  // Careers: admin reply to applicant
  jobApplicationAdminReply: (applicantName, jobTitle, message, fromName) => ({
    subject: `Re: Your application – ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #111827; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 20px;">Regarding your application</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 28px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 16px;">Dear ${applicantName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 16px;">
            Thank you for your interest in <strong>${jobTitle}</strong>.
          </p>
          <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; white-space: pre-line;">
            ${message}
          </div>
          <p style="font-size: 14px; line-height: 1.6; margin-top: 18px;">
            Best regards,<br />
            ${fromName || "Com Financial Services"}
          </p>
        </div>
      </div>
    `,
    text: `Dear ${applicantName},\n\nThank you for your interest in ${jobTitle}.\n\n${message}\n\nBest regards,\n${
      fromName || "Com Financial Services"
    }`,
  }),

  // User blocking notification
  userBlocked: (userName, reason, adminName) => ({
    subject: "Account Blocked - Com Finance",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Account Blocked</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Your account has been blocked by our administration team.
          </p>
          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #dc2626;">Reason:</p>
            <p style="margin: 5px 0 0 0; color: #374151;">${
              reason || "No reason provided"
            }</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            If you believe this is an error, please contact our support team immediately.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:support@comFinance.co" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Contact Support
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            This action was taken by: ${adminName}<br>
            Com Finance Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nYour account has been blocked by our administration team.\n\nReason: ${
      reason || "No reason provided"
    }\n\nIf you believe this is an error, please contact our support team immediately.\n\nContact: support@comFinance.co\n\nThis action was taken by: ${adminName}\n\nCom Finance Team`,
  }),

  // User unblocking notification
  userUnblocked: (userName, adminName) => ({
    subject: "Account Unblocked - Com Finance",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Account Unblocked</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Great news! Your account has been unblocked and you can now access all features of our platform.
          </p>
          <div style="background-color: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #059669;">You can now:</p>
            <ul style="margin: 5px 0 0 0; color: #374151; padding-left: 20px;">
              <li>Access your dashboard</li>
              <li>Submit new forms</li>
              <li>View your submissions</li>
              <li>Download reports</li>
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/dashboard" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Dashboard
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            This action was taken by: ${adminName}<br>
            Com Finance Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nGreat news! Your account has been unblocked and you can now access all features of our platform.\n\nYou can now:\n- Access your dashboard\n- Submit new forms\n- View your submissions\n- Download reports\n\nAccess your dashboard: ${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/dashboard\n\nThis action was taken by: ${adminName}\n\nCom Finance Team`,
  }),

  // Form status update notification
  formStatusUpdate: (userName, formType, status, message, adminName) => ({
    subject: `Form Status Update - ${formType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Form Status Update</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            Your ${formType} form status has been updated.
          </p>
          <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; font-weight: bold; color: #2563eb;">New Status:</p>
            <p style="margin: 5px 0 0 0; color: #374151; font-size: 18px; font-weight: bold;">${status}</p>
          </div>
          ${
            message
              ? `
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #374151;">Message from Admin:</p>
            <p style="margin: 5px 0 0 0; color: #374151;">${message}</p>
          </div>
          `
              : ""
          }
          <div style="text-align: center; margin: 30px 0;">
            <a href="${
              process.env.FRONTEND_URL || "http://localhost:3000"
            }/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Form Status
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            Updated by: ${adminName}<br>
            Com Finance Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nYour ${formType} form status has been updated to: ${status}\n\n${
      message ? `Message from Admin: ${message}\n\n` : ""
    }View your form status: ${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/dashboard\n\nUpdated by: ${adminName}\n\nCom Finance Team`,
  }),
};

module.exports = emailTemplates;
