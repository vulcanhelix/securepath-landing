export const getClientConfirmationEmail = (data) => {
  const { clientName, assessmentType, overallScore, maxScore, verdict, companyName } = data;
  const percentage = Math.round((overallScore / maxScore) * 100);

  return {
    subject: `Your ${assessmentType} Assessment Results - SecurePath Consulting`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assessment Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <tr>
            <td style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">SecurePath Consulting</h1>
              <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 14px;">Privacy & Security Assessment Results</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">Hello ${clientName},</h2>

              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Thank you for completing your <strong>${assessmentType}</strong> assessment${companyName ? ` for ${companyName}` : ''}.
                We've received your responses and our team is reviewing them.
              </p>

              <div style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <h3 style="margin: 0 0 15px 0; color: #1e293b; font-size: 18px; font-weight: 600;">Your Assessment Score</h3>
                <p style="margin: 0 0 10px 0; color: #475569; font-size: 32px; font-weight: 700;">${percentage}%</p>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px;">Score: ${overallScore} out of ${maxScore}</p>
                <p style="margin: 0; color: #64748b; font-size: 14px; font-weight: 600;">Verdict: ${verdict}</p>
              </div>

              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                One of our consultants will be in touch with you shortly to discuss your results and provide personalized recommendations
                for improving your compliance posture.
              </p>

              <p style="margin: 0 0 20px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                In the meantime, if you have any questions, please don't hesitate to reach out to us.
              </p>

              <div style="background-color: #eff6ff; padding: 20px; border-radius: 4px; margin: 30px 0;">
                <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 600;">What happens next?</h4>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                  <li>Our team will review your complete assessment</li>
                  <li>We'll prepare a detailed analysis of your compliance gaps</li>
                  <li>You'll receive personalized recommendations for improvement</li>
                  <li>We'll schedule a consultation call to discuss next steps</li>
                </ul>
              </div>

              <p style="margin: 30px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #1e293b;">The SecurePath Consulting Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px;">
                SecurePath Consulting
              </p>
              <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px;">
                Privacy, Security & Compliance Experts
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                This email was sent in response to your assessment completion.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
};

export const getTeamNotificationEmail = (data) => {
  const {
    clientName,
    clientEmail,
    companyName,
    assessmentType,
    overallScore,
    maxScore,
    verdict,
    categoryScores,
    answers
  } = data;

  const percentage = Math.round((overallScore / maxScore) * 100);

  const categoryRows = Object.entries(categoryScores || {}).map(([category, score]) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #475569; font-size: 14px;">${category}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: center;">${score.current} / ${score.max}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; color: #1e293b; font-size: 14px; font-weight: 600; text-align: center;">${Math.round((score.current / score.max) * 100)}%</td>
    </tr>
  `).join('');

  const answerRows = answers.map((answer, index) => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; vertical-align: top;">
        <strong style="color: #1e293b; font-size: 14px;">Q${index + 1}:</strong>
        <p style="margin: 5px 0 0 0; color: #475569; font-size: 14px; line-height: 1.5;">${answer.question}</p>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; text-align: center; vertical-align: top;">
        <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 13px; font-weight: 600; ${
          answer.answer === 'Yes'
            ? 'background-color: #dcfce7; color: #166534;'
            : answer.answer === 'No'
            ? 'background-color: #fee2e2; color: #991b1b;'
            : 'background-color: #fef3c7; color: #92400e;'
        }">
          ${answer.answer}
        </span>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e2e8f0; text-align: center; vertical-align: top; color: #1e293b; font-size: 14px; font-weight: 600;">
        ${answer.score}
      </td>
    </tr>
  `).join('');

  return {
    subject: `🚨 New ${assessmentType} Assessment Completed - ${clientName}${companyName ? ` (${companyName})` : ''}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Assessment Completed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="800" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <tr>
            <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 600;">🚨 New Assessment Completed</h1>
              <p style="margin: 10px 0 0 0; color: #fee2e2; font-size: 14px;">A client has completed a ${assessmentType} assessment</p>
            </td>
          </tr>

          <tr>
            <td style="padding: 30px;">

              <div style="background-color: #f8fafc; padding: 25px; border-radius: 6px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Client Information</h2>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;">Name:</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${clientName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Email:</td>
                    <td style="padding: 8px 0;"><a href="mailto:${clientEmail}" style="color: #3b82f6; text-decoration: none; font-size: 14px; font-weight: 600;">${clientEmail}</a></td>
                  </tr>
                  ${companyName ? `
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Company:</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${companyName}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Assessment Type:</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${assessmentType}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Completed:</td>
                    <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 600;">${new Date().toLocaleString()}</td>
                  </tr>
                </table>
              </div>

              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 6px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
                <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 20px; font-weight: 600;">Overall Score</h2>
                <p style="margin: 0; color: #1e293b; font-size: 48px; font-weight: 700;">${percentage}%</p>
                <p style="margin: 10px 0 5px 0; color: #475569; font-size: 16px;">Score: ${overallScore} out of ${maxScore}</p>
                <p style="margin: 5px 0 0 0; color: #475569; font-size: 16px; font-weight: 600;">Verdict: ${verdict}</p>
              </div>

              ${categoryRows ? `
              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Category Breakdown</h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 12px; text-align: left; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Category</th>
                      <th style="padding: 12px; text-align: center; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Score</th>
                      <th style="padding: 12px; text-align: center; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${categoryRows}
                  </tbody>
                </table>
              </div>
              ` : ''}

              <div style="margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px; font-weight: 600; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Complete Assessment Responses</h2>
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                  <thead>
                    <tr style="background-color: #f8fafc;">
                      <th style="padding: 12px; text-align: left; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0;">Question</th>
                      <th style="padding: 12px; text-align: center; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; width: 120px;">Answer</th>
                      <th style="padding: 12px; text-align: center; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; width: 80px;">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${answerRows}
                  </tbody>
                </table>
              </div>

              <div style="background-color: #fef3c7; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                  <strong>Action Required:</strong> Please review this assessment and reach out to the client to discuss their results and next steps.
                  A PDF report matching the results page has been attached to this email.
                </p>
              </div>

            </td>
          </tr>

          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                This is an automated notification from the SecurePath Assessment System
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };
};
