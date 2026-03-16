import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssessmentData {
  assessmentType: string;
  clientName: string;
  clientEmail: string;
  companyName?: string;
  overallScore: number;
  maxScore: number;
  verdict: string;
  categoryScores: Record<string, { current: number; max: number }>;
  answers: Array<{
    question: string;
    answer: string;
    score: number;
  }>;
}

const escH = (s: string): string =>
  (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

const getVerdictColor = (verdict: string): string => {
  const v = (verdict || '').toLowerCase();
  if (v.includes('critical') || v.includes('high risk') || v.includes('non-compliant')) return '#ef4444';
  if (v.includes('moderate') || v.includes('medium') || v.includes('partial')) return '#f59e0b';
  if (v.includes('good') || v.includes('compliant') || v.includes('low risk') || v.includes('strong')) return '#10B981';
  return '#f59e0b';
};

const getAnswerStyle = (answer: string): string => {
  const a = (answer || '').toLowerCase();
  if (a === 'yes' || a.startsWith('yes')) return 'background-color: rgba(16,185,129,0.15); color: #10B981; border: 1px solid rgba(16,185,129,0.3);';
  if (a === 'no' || a.startsWith('no')) return 'background-color: rgba(239,68,68,0.15); color: #ef4444; border: 1px solid rgba(239,68,68,0.3);';
  if (a === 'n/a') return 'background-color: rgba(100,116,139,0.15); color: #94A3B8; border: 1px solid rgba(100,116,139,0.3);';
  return 'background-color: rgba(245,158,11,0.15); color: #fbbf24; border: 1px solid rgba(245,158,11,0.3);';
};

const getClientConfirmationHTML = (data: AssessmentData): string => {
  const { clientName, assessmentType, overallScore, maxScore, verdict, companyName, categoryScores } = data;
  const percentage = Math.round((overallScore / maxScore) * 100);
  const verdictColor = getVerdictColor(verdict);

  const categoryHTML = Object.entries(categoryScores || {}).map(([category, score]) => {
    const pct = Math.round((score.current / score.max) * 100);
    return `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b;">
          <span style="color: #F8FAFC; font-size: 14px; font-weight: 500;">${escH(category)}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; text-align: center;">
          <span style="color: #CBD5E1; font-size: 14px;">${score.current} / ${score.max}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; text-align: right;">
          <span style="font-family: 'Courier New', monospace; font-size: 14px; font-weight: 600; color: ${pct >= 70 ? '#10B981' : pct >= 40 ? '#f59e0b' : '#ef4444'};">${pct}%</span>
        </td>
      </tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Assessment Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f141d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f141d; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="640" cellpadding="0" cellspacing="0" style="background-color: #121620; border: 1px solid rgba(248,250,252,0.08); border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="padding: 40px 40px 32px; border-bottom: 1px solid rgba(248,250,252,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family: 'Courier New', monospace; font-size: 11px; color: #10B981; letter-spacing: 2px; text-transform: uppercase;">CONFIDENTIAL ASSESSMENT REPORT</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 12px;">
                    <span style="font-size: 24px; font-weight: 700; color: #F8FAFC; letter-spacing: -0.02em;">secure</span><span style="font-size: 24px; font-weight: 700; color: #10B981; letter-spacing: -0.02em;">path</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 4px;">
                    <span style="font-size: 13px; color: #64748B;">Privacy &amp; Security Assessment Results</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 40px;">
              <p style="margin: 0 0 24px 0; color: #CBD5E1; font-size: 16px; line-height: 1.6;">
                Hello <strong style="color: #F8FAFC;">${escH(clientName)}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; color: #94A3B8; font-size: 15px; line-height: 1.6;">
                Thank you for completing your <strong style="color: #F8FAFC;">${escH(assessmentType)}</strong> assessment${companyName ? ` for <strong style="color: #F8FAFC;">${escH(companyName)}</strong>` : ''}. Your responses have been received and our team is reviewing them.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(248,250,252,0.08); border-radius: 12px; overflow: hidden; margin: 32px 0;">
                <tr>
                  <td style="padding: 0;">
                    <div style="height: 2px; background: linear-gradient(90deg, ${verdictColor}, transparent 60%);"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="120" style="vertical-align: top; text-align: center; padding-right: 24px;">
                          <div style="font-family: 'Courier New', monospace; font-size: 48px; font-weight: 700; color: ${verdictColor}; line-height: 1;">${percentage}%</div>
                          <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #64748B; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 8px;">OVERALL SCORE</div>
                        </td>
                        <td style="vertical-align: top; border-left: 1px solid rgba(248,250,252,0.08); padding-left: 24px;">
                          <div style="display: inline-block; padding: 4px 14px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; color: ${verdictColor}; background-color: ${verdictColor}15; border: 1px solid ${verdictColor}40; margin-bottom: 12px;">${escH(verdict)}</div>
                          <p style="margin: 0 0 6px 0; color: #94A3B8; font-size: 14px;">Score: <strong style="color: #CBD5E1;">${overallScore}</strong> out of <strong style="color: #CBD5E1;">${maxScore}</strong></p>
                          <p style="margin: 0; color: #64748B; font-size: 13px;">Assessment: ${escH(assessmentType)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${categoryHTML ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 24px 0 32px; border-collapse: collapse;">
                <tr>
                  <td colspan="3" style="padding: 0 0 12px 0;">
                    <span style="font-family: 'Courier New', monospace; font-size: 10px; color: #64748B; letter-spacing: 1.5px; text-transform: uppercase;">PERFORMANCE BY DOMAIN</span>
                  </td>
                </tr>
                <tr style="background-color: rgba(255,255,255,0.03);">
                  <th style="padding: 10px 16px; text-align: left; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">Domain</th>
                  <th style="padding: 10px 16px; text-align: center; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">Score</th>
                  <th style="padding: 10px 16px; text-align: right; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">%</th>
                </tr>
                ${categoryHTML}
              </table>
              ` : ''}

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(16,185,129,0.05); border: 1px solid rgba(16,185,129,0.15); border-radius: 8px; margin: 32px 0;">
                <tr>
                  <td style="padding: 24px;">
                    <p style="margin: 0 0 4px 0; color: #10B981; font-size: 14px; font-weight: 600;">What happens next?</p>
                    <table cellpadding="0" cellspacing="0" style="margin-top: 12px;">
                      <tr><td style="padding: 4px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">1. Our team will review your complete assessment</td></tr>
                      <tr><td style="padding: 4px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">2. We'll prepare a detailed analysis of your compliance gaps</td></tr>
                      <tr><td style="padding: 4px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">3. You'll receive personalised recommendations for improvement</td></tr>
                      <tr><td style="padding: 4px 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">4. We'll schedule a consultation call to discuss next steps</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 32px 0 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                If you have any questions, please don't hesitate to reach out.
              </p>
              <p style="margin: 16px 0 0 0; color: #94A3B8; font-size: 14px; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #F8FAFC;">The SecurePath Consulting Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color: rgba(0,0,0,0.3); padding: 24px 40px; text-align: center; border-top: 1px solid rgba(248,250,252,0.06);">
              <p style="margin: 0 0 6px 0; color: #64748B; font-size: 12px;">
                <span style="color: #F8FAFC; font-weight: 600;">secure</span><span style="color: #10B981; font-weight: 600;">path</span>
                <span style="color: #334155; margin: 0 6px;">|</span>
                Privacy, Security &amp; Compliance
              </p>
              <p style="margin: 0; color: #475569; font-size: 11px;">
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
  `;
};

const getTeamNotificationHTML = (data: AssessmentData): string => {
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
  const verdictColor = getVerdictColor(verdict);

  const categoryRows = Object.entries(categoryScores || {}).map(([category, score]) => {
    const pct = Math.round((score.current / score.max) * 100);
    const barColor = pct >= 70 ? '#10B981' : pct >= 40 ? '#f59e0b' : '#ef4444';
    const statusLabel = pct >= 70 ? 'Strong' : pct >= 40 ? 'Developing' : 'High Risk';
    return `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b;">
          <span style="color: #F8FAFC; font-size: 14px; font-weight: 500;">${escH(category)}</span>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b; text-align: center;">
          <span style="color: #CBD5E1; font-size: 14px;">${score.current} / ${score.max}</span>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b; text-align: center;">
          <span style="font-family: 'Courier New', monospace; font-size: 14px; font-weight: 600; color: ${barColor};">${pct}%</span>
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b; text-align: right;">
          <span style="display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; color: ${barColor}; background-color: ${barColor}15; border: 1px solid ${barColor}30;">${statusLabel}</span>
        </td>
      </tr>`;
  }).join('');

  const answerRows = (answers || []).map((answer, index) => {
    const ansText = escH(answer.answer || 'N/A');
    const qText = escH(answer.question || `Question ${index + 1}`);
    return `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; vertical-align: top; width: 36px;">
          <span style="font-family: 'Courier New', monospace; font-size: 12px; color: #64748B; font-weight: 600;">${String(index + 1).padStart(2, '0')}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; vertical-align: top;">
          <span style="color: #CBD5E1; font-size: 13px; line-height: 1.5;">${qText}</span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; text-align: center; vertical-align: top;">
          <span style="display: inline-block; padding: 3px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; white-space: nowrap; ${getAnswerStyle(answer.answer)}">
            ${ansText}
          </span>
        </td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #1e293b; text-align: center; vertical-align: top;">
          <span style="font-family: 'Courier New', monospace; font-size: 13px; font-weight: 600; color: ${answer.score > 0 ? '#10B981' : '#ef4444'};">${answer.score}</span>
        </td>
      </tr>`;
  }).join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Assessment Completed</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f141d;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f141d; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="800" cellpadding="0" cellspacing="0" style="background-color: #121620; border: 1px solid rgba(248,250,252,0.08); border-radius: 12px; overflow: hidden;">

          <tr>
            <td style="padding: 0;">
              <div style="height: 3px; background: linear-gradient(90deg, ${verdictColor}, transparent 60%);"></div>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 40px; border-bottom: 1px solid rgba(248,250,252,0.08);">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family: 'Courier New', monospace; font-size: 11px; color: ${verdictColor}; letter-spacing: 2px; text-transform: uppercase;">NEW ASSESSMENT COMPLETED</span>
                  </td>
                  <td style="text-align: right;">
                    <span style="font-size: 18px; font-weight: 700; color: #F8FAFC; letter-spacing: -0.02em;">secure</span><span style="font-size: 18px; font-weight: 700; color: #10B981; letter-spacing: -0.02em;">path</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding-top: 6px;">
                    <span style="font-size: 13px; color: #94A3B8;">A client has completed a <strong style="color: #F8FAFC;">${escH(assessmentType)}</strong> assessment</span>
                  </td>
                  <td></td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding: 32px 40px;">

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(248,250,252,0.08); border-radius: 8px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td colspan="4" style="padding-bottom: 14px;">
                          <span style="font-family: 'Courier New', monospace; font-size: 10px; color: #64748B; letter-spacing: 1.5px; text-transform: uppercase;">CLIENT INFORMATION</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; width: 100px;">
                          <span style="font-family: 'Courier New', monospace; font-size: 11px; color: #64748B; letter-spacing: 0.5px;">Name</span>
                        </td>
                        <td style="padding: 6px 16px 6px 0;">
                          <span style="color: #F8FAFC; font-size: 14px; font-weight: 600;">${escH(clientName)}</span>
                        </td>
                        <td style="padding: 6px 0; width: 100px;">
                          <span style="font-family: 'Courier New', monospace; font-size: 11px; color: #64748B; letter-spacing: 0.5px;">Email</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <a href="mailto:${escH(clientEmail)}" style="color: #10B981; text-decoration: none; font-size: 14px; font-weight: 600;">${escH(clientEmail)}</a>
                        </td>
                      </tr>
                      ${companyName ? `
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-family: 'Courier New', monospace; font-size: 11px; color: #64748B; letter-spacing: 0.5px;">Company</span>
                        </td>
                        <td style="padding: 6px 16px 6px 0;">
                          <span style="color: #F8FAFC; font-size: 14px; font-weight: 600;">${escH(companyName)}</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="font-family: 'Courier New', monospace; font-size: 11px; color: #64748B; letter-spacing: 0.5px;">Date</span>
                        </td>
                        <td style="padding: 6px 0;">
                          <span style="color: #CBD5E1; font-size: 14px;">${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </td>
                      </tr>
                      ` : `
                      <tr>
                        <td style="padding: 6px 0;">
                          <span style="font-family: 'Courier New', monospace; font-size: 11px; color: #64748B; letter-spacing: 0.5px;">Date</span>
                        </td>
                        <td style="padding: 6px 0;" colspan="3">
                          <span style="color: #CBD5E1; font-size: 14px;">${new Date().toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </td>
                      </tr>
                      `}
                    </table>
                  </td>
                </tr>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(255,255,255,0.02); border: 1px solid rgba(248,250,252,0.08); border-radius: 12px; overflow: hidden; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 0;">
                    <div style="height: 2px; background: linear-gradient(90deg, ${verdictColor}, transparent 60%);"></div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 28px 32px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="140" style="vertical-align: top; text-align: center; padding-right: 28px;">
                          <div style="font-family: 'Courier New', monospace; font-size: 52px; font-weight: 700; color: ${verdictColor}; line-height: 1;">${percentage}%</div>
                          <div style="font-family: 'Courier New', monospace; font-size: 10px; color: #64748B; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 8px;">OVERALL READINESS</div>
                        </td>
                        <td style="vertical-align: top; border-left: 1px solid rgba(248,250,252,0.08); padding-left: 28px;">
                          <div style="display: inline-block; padding: 4px 14px; border-radius: 6px; font-family: 'Courier New', monospace; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; color: ${verdictColor}; background-color: ${verdictColor}15; border: 1px solid ${verdictColor}40; margin-bottom: 14px;">${escH(verdict)}</div>
                          <p style="margin: 0 0 8px 0; color: #CBD5E1; font-size: 15px;">Score: <strong style="color: #F8FAFC;">${overallScore}</strong> out of <strong style="color: #F8FAFC;">${maxScore}</strong></p>
                          <p style="margin: 0; color: #64748B; font-size: 13px;">Assessment: ${escH(assessmentType)}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              ${categoryRows ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border-collapse: collapse;">
                <tr>
                  <td colspan="4" style="padding: 0 0 14px 0;">
                    <span style="font-family: 'Courier New', monospace; font-size: 10px; color: #10B981; letter-spacing: 1.5px; text-transform: uppercase;">SECTION 1</span>
                    <span style="display: block; margin-top: 4px; font-size: 18px; font-weight: 700; color: #F8FAFC;">Performance by Domain</span>
                    <div style="height: 1px; background: linear-gradient(90deg, rgba(248,250,252,0.12), transparent); margin-top: 12px;"></div>
                  </td>
                </tr>
                <tr style="background-color: rgba(255,255,255,0.03);">
                  <th style="padding: 10px 16px; text-align: left; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">Domain</th>
                  <th style="padding: 10px 16px; text-align: center; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">Score</th>
                  <th style="padding: 10px 16px; text-align: center; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">%</th>
                  <th style="padding: 10px 16px; text-align: right; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">Status</th>
                </tr>
                ${categoryRows}
              </table>
              ` : ''}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 28px; border-collapse: collapse;">
                <tr>
                  <td colspan="4" style="padding: 0 0 14px 0;">
                    <span style="font-family: 'Courier New', monospace; font-size: 10px; color: #10B981; letter-spacing: 1.5px; text-transform: uppercase;">SECTION 2</span>
                    <span style="display: block; margin-top: 4px; font-size: 18px; font-weight: 700; color: #F8FAFC;">Complete Assessment Responses</span>
                    <div style="height: 1px; background: linear-gradient(90deg, rgba(248,250,252,0.12), transparent); margin-top: 12px;"></div>
                  </td>
                </tr>
                <tr style="background-color: rgba(255,255,255,0.03);">
                  <th style="padding: 10px 16px; text-align: left; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b; width: 36px;">#</th>
                  <th style="padding: 10px 16px; text-align: left; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b;">Question</th>
                  <th style="padding: 10px 16px; text-align: center; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b; width: 120px;">Response</th>
                  <th style="padding: 10px 16px; text-align: center; color: #64748B; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-bottom: 1px solid #1e293b; width: 60px;">Pts</th>
                </tr>
                ${answerRows}
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(245,158,11,0.06); border: 1px solid rgba(245,158,11,0.2); border-radius: 8px; border-left: 3px solid #f59e0b;">
                <tr>
                  <td style="padding: 20px 24px;">
                    <p style="margin: 0 0 4px 0; color: #fbbf24; font-size: 14px; font-weight: 700;">Action Required</p>
                    <p style="margin: 0; color: #94A3B8; font-size: 13px; line-height: 1.6;">
                      Please review this assessment and reach out to the client to discuss their results and next steps.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <tr>
            <td style="background-color: rgba(0,0,0,0.3); padding: 20px 40px; text-align: center; border-top: 1px solid rgba(248,250,252,0.06);">
              <p style="margin: 0; color: #475569; font-size: 11px;">
                Automated notification from the SecurePath Assessment System
              </p>
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const data: AssessmentData = await req.json();
    console.log("Received assessment data:", {
      type: data.assessmentType,
      client: data.clientEmail,
      score: data.overallScore
    });

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("RESEND_API_KEY not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    const clientEmailHTML = getClientConfirmationHTML(data);
    const teamEmailHTML = getTeamNotificationHTML(data);

    console.log("Sending client email to:", data.clientEmail);
    const clientEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SecurePath Consulting <onboarding@resend.dev>",
        to: ["bruce.m@securepathconsulting.co.za"],
        subject: `Your ${data.assessmentType} Assessment Results - SecurePath Consulting`,
        html: clientEmailHTML,
      }),
    });

    console.log("Sending team notification emails");
    const teamEmailPromise = fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "SecurePath Assessment System <onboarding@resend.dev>",
        to: ["bruce.m@securepathconsulting.co.za"],
        subject: `New ${data.assessmentType} Assessment Completed - ${data.clientName}${data.companyName ? ` (${data.companyName})` : ''}`,
        html: teamEmailHTML,
      }),
    });

    const [clientEmailResponse, teamEmailResponse] = await Promise.all([
      clientEmailPromise,
      teamEmailPromise,
    ]);

    const clientEmailResult = await clientEmailResponse.json();
    const teamEmailResult = await teamEmailResponse.json();

    console.log("Client email response:", {
      ok: clientEmailResponse.ok,
      status: clientEmailResponse.status,
      result: clientEmailResult
    });
    console.log("Team email response:", {
      ok: teamEmailResponse.ok,
      status: teamEmailResponse.status,
      result: teamEmailResult
    });

    if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
      const { createClient } = await import("npm:@supabase/supabase-js@2");
      const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

      await supabase.from("assessments").insert({
        assessment_type: data.assessmentType,
        client_name: data.clientName,
        client_email: data.clientEmail,
        company_name: data.companyName || null,
        overall_score: data.overallScore,
        max_score: data.maxScore,
        verdict: data.verdict,
        category_scores: data.categoryScores,
        answers: data.answers,
        email_sent: clientEmailResponse.ok && teamEmailResponse.ok,
        pdf_generated: false,
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        clientEmail: clientEmailResult,
        teamEmail: teamEmailResult,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error processing assessment:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
