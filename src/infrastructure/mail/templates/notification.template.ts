type NotificationVariant = 'info' | 'success' | 'warning' | 'danger';

interface NotificationTemplateOptions {
  fullName?: string;
  title: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  appName?: string;
  supportEmail?: string;
  variant?: NotificationVariant;
}

interface NotificationTemplate {
  subject: string;
  html: string;
  text: string;
}

const defaultAppName = process.env.APP_NAME || 'NestJS CQRS Starter';
const defaultSupportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';

const variantTheme: Record<
  NotificationVariant,
  { primary: string; light: string }
> = {
  info: { primary: '#4263eb', light: '#edf2ff' },
  success: { primary: '#2b8a3e', light: '#ebfbee' },
  warning: { primary: '#d9480f', light: '#fff4e6' },
  danger: { primary: '#c92a2a', light: '#fff5f5' },
};

export const renderNotificationTemplate = (
  options: NotificationTemplateOptions,
): NotificationTemplate => {
  const fullName = options.fullName || 'bạn';
  const appName = options.appName || defaultAppName;
  const supportEmail = options.supportEmail || defaultSupportEmail;
  const variant = options.variant || 'info';
  const theme = variantTheme[variant];

  const subject = `[${appName}] ${options.title}`;

  const html = `
  <div style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #020617, #0f172a); padding: 42px 24px; color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 0 auto;">
      <tr>
        <td>
          <div style="background: rgba(2,6,23,0.75); border-radius: 26px; padding: 38px; border: 1px solid rgba(148,163,184,0.2); box-shadow: 0 25px 65px rgba(2,6,23,0.5); backdrop-filter: blur(18px);">
            <div style="text-align: center; margin-bottom: 28px;">
              <span style="display: inline-block; padding: 10px 20px; border-radius: 999px; background: rgba(15,23,42,0.6); color: ${theme.light}; font-size: 13px;">
                ${appName}
              </span>
              <h1 style="font-size: 28px; margin: 18px 0 10px; color: #f8fafc;">${options.title}</h1>
              <p style="color: rgba(248, 250, 252, 0.75); margin: 0; font-size: 15px;">Xin chào ${fullName},</p>
            </div>

            <div style="border-radius: 18px; padding: 26px; background: rgba(15,23,42,0.45); border: 1px solid rgba(148,163,184,0.2); margin-bottom: 30px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.75; color: rgba(248,250,252,0.9);">
                ${options.message}
              </p>
            </div>

            ${
              options.ctaLabel && options.ctaUrl
                ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
              <tr>
                <td style="text-align: center;">
                  <a href="${options.ctaUrl}"
                     style="display: inline-block; padding: 16px 40px; border-radius: 999px; font-weight: 600; text-decoration: none; background: ${theme.primary}; color: #0f172a; box-shadow: 0 15px 35px ${theme.primary}40;">
                    ${options.ctaLabel}
                  </a>
                </td>
              </tr>
            </table>`
                : ''
            }

            <p style="margin: 0; color: rgba(148, 163, 184, 0.85); font-size: 14px; text-align: center;">
              Trân trọng,<br/>Đội ngũ ${appName}
            </p>

            <p style="text-align: center; margin: 28px 0 0; color: rgba(148,163,184,0.75); font-size: 12px;">
              Cần hỗ trợ? Liên hệ <a href="mailto:${supportEmail}" style="color: ${theme.light}; text-decoration: none;">${supportEmail}</a>.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  const text = `Xin chào ${fullName},

${options.message}

${options.ctaLabel && options.ctaUrl ? `${options.ctaLabel}: ${options.ctaUrl}\n\n` : ''}

Trân trọng,
Đội ngũ ${appName}
Liên hệ hỗ trợ: ${supportEmail}`;

  return {
    subject,
    html,
    text,
  };
};
