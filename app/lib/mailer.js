import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send a meeting reminder email.
 * @param {Object} opts
 * @param {string} opts.to          - recipient email
 * @param {string} opts.recipientName - display name of recipient
 * @param {string} opts.internName  - intern's name
 * @param {string} opts.adminName   - admin's name / email
 * @param {string} opts.date        - date string
 * @param {string} opts.time        - time string (HH:MM)
 * @param {string} opts.meetingLink - the URL
 * @param {string} opts.description - meeting description
 * @param {'intern'|'admin'} opts.role
 */
export async function sendMeetingReminder(opts) {
  const { to, recipientName, internName, adminName, date, time, meetingLink, description, role } = opts;

  const formattedDate = new Date(date).toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const subject = role === 'admin'
    ? `📅 Meeting Scheduled with ${internName} — ${formattedDate}`
    : `📅 Your Meeting is Confirmed — ${formattedDate}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Meeting Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:#000000;padding:36px 40px;">
              <p style="margin:0;color:rgba(255,255,255,0.4);font-size:11px;letter-spacing:0.25em;text-transform:uppercase;font-weight:700;">
                Digital South — Internship Portal
              </p>
              <h1 style="margin:12px 0 0;color:#ffffff;font-size:26px;font-weight:900;letter-spacing:-0.5px;">
                ${role === 'admin' ? '📋 New Meeting Assigned' : '📅 Meeting Confirmed'}
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="color:#374151;font-size:15px;margin:0 0 24px;">
                Hello <strong>${recipientName}</strong>,
              </p>
              <p style="color:#6b7280;font-size:14px;margin:0 0 28px;line-height:1.6;">
                ${role === 'admin'
      ? `A meeting has been scheduled with intern <strong>${internName}</strong>. Please join on time.`
      : `Your dedicated admin <strong>${adminName}</strong> has scheduled a meeting with you. Please join on time.`}
              </p>

              <!-- Meeting Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:16px;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Date</span><br>
                          <span style="color:#111827;font-size:15px;font-weight:700;margin-top:4px;display:block;">${formattedDate}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Time</span><br>
                          <span style="color:#111827;font-size:15px;font-weight:700;margin-top:4px;display:block;">${time}</span>
                        </td>
                      </tr>
                      ${role === 'admin' ? `
                      <tr>
                        <td style="padding:12px 0;border-bottom:1px solid #e5e7eb;">
                          <span style="color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Intern</span><br>
                          <span style="color:#111827;font-size:15px;font-weight:700;margin-top:4px;display:block;">${internName}</span>
                        </td>
                      </tr>` : ''}
                      <tr>
                        <td style="padding:12px 0;">
                          <span style="color:#9ca3af;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">Agenda</span><br>
                          <span style="color:#374151;font-size:14px;margin-top:4px;display:block;line-height:1.5;">${description}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${meetingLink}" target="_blank"
                       style="display:inline-block;background:#000000;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:14px;font-size:13px;font-weight:900;letter-spacing:0.15em;text-transform:uppercase;">
                      🔗 Join Meeting
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#d1d5db;font-size:12px;text-align:center;margin:28px 0 0;">
                If the button doesn't work, copy this link:<br>
                <a href="${meetingLink}" style="color:#6b7280;word-break:break-all;">${meetingLink}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f3f4f6;">
              <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center;">
                Digital South Internship Portal &mdash; This is an automated reminder.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  await transporter.sendMail({
    from: `"Digital South Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}

/**
 * Send missed meeting warning.
 * @param {Object} opts
 * @param {string} opts.to
 * @param {string} opts.internName
 * @param {number} opts.warningCount (1, 2, or 3)
 */
export async function sendMissedMeetingWarning({ to, internName, warningCount }) {
  let subject, title, body;

  if (warningCount === 1) {
    subject = `⚠️ Urgent: Missed Weekly Review (Warning 1/3)`;
    title = `Missed Meeting Warning 1`;
    body = `Hi ${internName},<br><br>We noticed you missed your scheduled Weekly Review. Attendance is mandatory for the internship progression. Please ensure you attend all future meetings to avoid termination of your internship.<br><br>Please respond to this email with your explanation.`;
  } else if (warningCount === 2) {
    subject = `🚨 Final Warning: Missed Weekly Review (Warning 2/3)`;
    title = `Missed Meeting Warning 2`;
    body = `Hi ${internName},<br><br>This is your Second Warning for missing a scheduled Weekly Review. <strong>If you miss one more meeting, your internship will be automatically terminated.</strong><br><br>Please reach out to your assigned admin immediately.`;
  } else {
    subject = `❌ Account Frozen: Internship Terminated (Warning 3/3)`;
    title = `Internship Terminated`;
    body = `Hi ${internName},<br><br>You have missed 3 consecutive required meetings. As per our policy, your internship has now been terminated and your account is frozen.<br><br>If you believe this is an error, please contact the administrators.`;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: ${warningCount >= 3 ? '#ef4444' : '#f59e0b'}; margin-top: 0; text-transform: uppercase;">${title}</h2>
        <p style="color: #374151; line-height: 1.6;">${body}</p>
        <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 20px 0;">
        <p style="color: #9ca3af; font-size: 12px;">Digital South Internship Portal &mdash; Automated Warning System</p>
    </div>
    `;

  await transporter.sendMail({
    from: `"Digital South Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
}
