interface WelcomeTemplateOptions {
  userId?: string;
  fullName?: string;
  appName?: string;
  loginUrl?: string;
  activationUrl?: string;
  supportEmail?: string;
}

interface WelcomeTemplate {
  subject: string;
  html: string;
  text: string;
}

const defaultAppName = process.env.APP_NAME || 'NestJS CQRS Starter';
const defaultLoginUrl =
  process.env.APP_LOGIN_URL ||
  `${process.env.APP_URL || 'http://localhost:3000'}/login`;
const defaultActivationUrl =
  process.env.APP_ACTIVATION_URL ||
  `${process.env.APP_URL || 'http://localhost:3000'}/activate`;
const defaultSupportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';

export const renderWelcomeTemplate = (
  options: WelcomeTemplateOptions = {},
): WelcomeTemplate => {
  const fullName = options.fullName || 'bạn';
  const appName = options.appName || defaultAppName;
  const loginUrl = options.loginUrl || defaultLoginUrl;
  const activationUrl = options.activationUrl || defaultActivationUrl;
  const activationWithId =
    options.userId && activationUrl
      ? `${activationUrl.replace(/\/$/, '')}/${options.userId}`
      : activationUrl;
  const supportEmail = options.supportEmail || defaultSupportEmail;

  const subject = `Chào mừng bạn đến với ${appName}`;

  const html = `
  <div style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(120deg, #0f172a, #1e1e2f, #111827); padding: 40px 24px; color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 0 auto;">
      <tr>
        <td>
          <div style="background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(15,23,42,0.6)); border-radius: 28px; padding: 40px; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 25px 60px rgba(15,23,42,0.35); backdrop-filter: blur(16px);">
            <div style="text-align: center; margin-bottom: 32px;">
              <p style="text-transform: uppercase; letter-spacing: 0.3rem; font-size: 12px; color: rgba(148, 163, 184, 0.9); margin: 0 0 12px;">${appName}</p>
              <h1 style="font-size: 32px; margin: 0; color: #f8fafc; font-weight: 700;">Chào mừng, ${fullName}!</h1>
              <p style="color: rgba(226, 232, 240, 0.9); margin: 12px 0 0; font-size: 15px;">
                Bạn đã đăng ký thành công tài khoản. Chỉ còn một bước để bắt đầu trải nghiệm.
              </p>
            </div>

            <div style="border-radius: 18px; padding: 28px; background: rgba(15, 23, 42, 0.45); border: 1px solid rgba(148, 163, 184, 0.15); margin-bottom: 32px;">
              <p style="margin: 0; color: rgba(226, 232, 240, 0.95); font-size: 16px; line-height: 1.75;">
                Hãy kích hoạt tài khoản và đăng nhập để khám phá đầy đủ tính năng.
              </p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
              <tr>
                <td style="text-align: center;">
                  <a href="${activationWithId}"
                     style="display: inline-block; padding: 16px 38px; border-radius: 999px; font-weight: 600; text-decoration: none; background: linear-gradient(135deg, #22d3ee, #0ea5e9); color: #0f172a; margin: 0 8px;">
                    Kích hoạt tài khoản
                  </a>
                  <a href="${loginUrl}"
                     style="display: inline-block; padding: 16px 38px; border-radius: 999px; font-weight: 600; text-decoration: none; border: 1px solid rgba(148, 163, 184, 0.35); color: #f8fafc; margin: 0 8px;">
                    Đăng nhập ngay
                  </a>
                </td>
              </tr>
            </table>

            <div style="border-radius: 18px; padding: 24px; background: rgba(15, 23, 42, 0.35); border: 1px solid rgba(148, 163, 184, 0.12); margin-bottom: 28px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: rgba(226,232,240,0.8);">
                Cần trợ giúp? Liên hệ chúng tôi qua <a href="mailto:${supportEmail}" style="color: #38bdf8; text-decoration: none;">${supportEmail}</a>.
              </p>
            </div>

            <p style="margin: 0; color: rgba(148, 163, 184, 0.9); font-size: 13px; text-align: center;">
              Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  const text = `Chào mừng, ${fullName}!

Bạn đã đăng ký thành công tài khoản tại ${appName}.

Kích hoạt tài khoản ngay: ${activationWithId}

Hãy đăng nhập ngay: ${loginUrl}

Nếu cần hỗ trợ, liên hệ ${supportEmail}.

Trân trọng,
Đội ngũ ${appName}`;

  return {
    subject,
    html,
    text,
  };
};
