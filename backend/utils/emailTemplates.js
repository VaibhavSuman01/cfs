const emailTemplates = {
  // User blocking notification
  userBlocked: (userName, reason, adminName) => ({
    subject: "Account Blocked - Com Finserv",
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
            <p style="margin: 5px 0 0 0; color: #374151;">${reason || 'No reason provided'}</p>
          </div>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            If you believe this is an error, please contact our support team immediately.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:support@comfinserv.co" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Contact Support
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            This action was taken by: ${adminName}<br>
            Com Finserv Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nYour account has been blocked by our administration team.\n\nReason: ${reason || 'No reason provided'}\n\nIf you believe this is an error, please contact our support team immediately.\n\nContact: support@comfinserv.co\n\nThis action was taken by: ${adminName}\n\nCom Finserv Team`
  }),

  // User unblocking notification
  userUnblocked: (userName, adminName) => ({
    subject: "Account Unblocked - Com Finserv",
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
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Dashboard
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            This action was taken by: ${adminName}<br>
            Com Finserv Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nGreat news! Your account has been unblocked and you can now access all features of our platform.\n\nYou can now:\n- Access your dashboard\n- Submit new forms\n- View your submissions\n- Download reports\n\nAccess your dashboard: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard\n\nThis action was taken by: ${adminName}\n\nCom Finserv Team`
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
          ${message ? `
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #374151;">Message from Admin:</p>
            <p style="margin: 5px 0 0 0; color: #374151;">${message}</p>
          </div>
          ` : ''}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Form Status
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            Updated by: ${adminName}<br>
            Com Finserv Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nYour ${formType} form status has been updated to: ${status}\n\n${message ? `Message from Admin: ${message}\n\n` : ''}View your form status: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard\n\nUpdated by: ${adminName}\n\nCom Finserv Team`
  }),

  // Report sent notification
  reportSent: (userName, reportType, message, adminName) => ({
    subject: `New Report Available - ${reportType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #7c3aed; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">New Report Available</h1>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${userName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            A new report of type <strong>${reportType}</strong> has been sent to you by our admin team.
          </p>
          ${message ? `
          <div style="background-color: #f3f4f6; padding: 15px; margin: 20px 0; border-radius: 6px;">
            <p style="margin: 0; font-weight: bold; color: #374151;">Message from Admin:</p>
            <p style="margin: 5px 0 0 0; color: #374151;">${message}</p>
          </div>
          ` : ''}
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Report
            </a>
          </div>
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            Sent by: ${adminName}<br>
            Com Finserv Team
          </p>
        </div>
      </div>
    `,
    text: `Dear ${userName},\n\nA new report of type ${reportType} has been sent to you by our admin team.\n\n${message ? `Message from Admin: ${message}\n\n` : ''}View your report: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard\n\nSent by: ${adminName}\n\nCom Finserv Team`
  }),

  // Weekly admin report
  weeklyAdminReport: (adminName, stats) => ({
    subject: "Weekly Admin Report - Com Finserv",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">Weekly Admin Report</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px;">${new Date().toLocaleDateString()}</p>
        </div>
        <div style="background-color: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${adminName},</p>
          <p style="font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
            Here's your weekly summary of platform activity:
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #1e40af; font-size: 24px;">${stats.newUsers || 0}</h3>
              <p style="margin: 0; color: #374151; font-weight: bold;">New Users</p>
            </div>
            <div style="background-color: #dcfce7; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #059669; font-size: 24px;">${stats.newForms || 0}</h3>
              <p style="margin: 0; color: #374151; font-weight: bold;">New Forms</p>
            </div>
            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #d97706; font-size: 24px;">${stats.pendingForms || 0}</h3>
              <p style="margin: 0; color: #374151; font-weight: bold;">Pending Forms</p>
            </div>
            <div style="background-color: #fce7f3; padding: 20px; border-radius: 8px; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #be185d; font-size: 24px;">${stats.newContacts || 0}</h3>
              <p style="margin: 0; color: #374151; font-weight: bold;">New Contacts</p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_URL || 'http://localhost:3001'}/admin" style="background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Admin Dashboard
            </a>
          </div>
          
          <p style="font-size: 12px; color: #6b7280; margin-top: 30px;">
            Com Finserv Admin Panel
          </p>
        </div>
      </div>
    `,
    text: `Dear ${adminName},\n\nHere's your weekly summary of platform activity:\n\n- New Users: ${stats.newUsers || 0}\n- New Forms: ${stats.newForms || 0}\n- Pending Forms: ${stats.pendingForms || 0}\n- New Contacts: ${stats.newContacts || 0}\n\nView admin dashboard: ${process.env.ADMIN_URL || 'http://localhost:3001'}/admin\n\nCom Finserv Admin Panel`
  })
};

module.exports = emailTemplates;
