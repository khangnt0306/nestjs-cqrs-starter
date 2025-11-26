interface ResetPasswordTemplateOptions {
  fullName?: string;
  resetUrl: string;
  expiresInMinutes?: number;
  appName?: string;
  supportEmail?: string;
}

interface ResetPasswordTemplate {
  subject: string;
  html: string;
  text: string;
}

const defaultAppName = process.env.APP_NAME || 'NestJS CQRS Starter';
const defaultSupportEmail = process.env.SUPPORT_EMAIL || 'support@example.com';

export const renderResetPasswordTemplate = (
  options: ResetPasswordTemplateOptions,
): ResetPasswordTemplate => {
  const fullName = options.fullName || 'bạn';
  const appName = options.appName || defaultAppName;
  const resetUrl = options.resetUrl;
  const expiresInMinutes = options.expiresInMinutes ?? 30;
  const supportEmail = options.supportEmail || defaultSupportEmail;

  const subject = `[${appName}] Yêu cầu đặt lại mật khẩu`;

  const html = `
  <div style="font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif; background: radial-gradient(circle at top left, #18181b, #0f172a, #030712); padding: 40px 24px; color: #f8fafc;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 680px; margin: 0 auto;">
      <tr>
        <td>
          <div style="background: rgba(3, 7, 18, 0.75); border-radius: 28px; padding: 40px; border: 1px solid rgba(148, 163, 184, 0.2); box-shadow: 0 30px 70px rgba(3,7,18,0.55); backdrop-filter: blur(20px);">
            <div style="text-align: center; margin-bottom: 30px;">
              <span style="display: inline-block; padding: 8px 18px; border-radius: 999px; background: rgba(248, 250, 252, 0.08); color: #fcd34d; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2rem;">
                ${appName}
              </span>
              <h1 style="font-size: 30px; margin: 18px 0 8px; color: #f8fafc;">Đặt lại mật khẩu</h1>
              <p style="color: rgba(248, 250, 252, 0.75); margin: 0; font-size: 15px;">Xin chào ${fullName}, bạn yêu cầu đặt lại mật khẩu.</p>
            </div>

            <div style="border-radius: 18px; padding: 26px; background: rgba(15, 23, 42, 0.45); border: 1px solid rgba(248, 250, 252, 0.12); margin-bottom: 28px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.8; color: rgba(248,250,252,0.85);">
                Nhấn nút bên dưới để tạo mật khẩu mới. Liên kết sẽ hết hạn trong <strong>${expiresInMinutes} phút</strong>.
              </p>
            </div>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
              <tr>
                <td style="text-align: center;">
                  <a href="${resetUrl}"
                     style="display: inline-block; padding: 16px 42px; border-radius: 999px; font-weight: 600; text-decoration: none; color: #030712; background: linear-gradient(135deg, #fde68a, #f97316); box-shadow: 0 15px 35px rgba(249, 115, 22, 0.4);">
                    Đặt lại mật khẩu
                  </a>
                </td>
              </tr>
            </table>

            <div style="border-radius: 18px; padding: 22px; background: rgba(3,7,18,0.65); border: 1px solid rgba(148,163,184,0.15);">
              <p style="margin: 0; font-size: 14px; color: rgba(248,250,252,0.7); line-height: 1.7;">
                Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email. Mật khẩu của bạn sẽ không đổi.
              </p>
            </div>

            <p style="text-align: center; margin: 30px 0 0; color: rgba(248, 250, 252, 0.75); font-size: 13px;">
              Cần hỗ trợ? Liên hệ <a href="mailto:${supportEmail}" style="color: #fcd34d; text-decoration: none;">${supportEmail}</a>.
            </p>
          </div>
        </td>
      </tr>
    </table>
  </div>
  `;

  const text = `Xin chào ${fullName},

Bạn vừa yêu cầu đặt lại mật khẩu tại ${appName}.

Nhấn vào liên kết bên dưới để đặt lại mật khẩu (hết hạn sau ${expiresInMinutes} phút):
${resetUrl}

Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email.

Trân trọng,
Đội ngũ ${appName}
Liên hệ hỗ trợ: ${supportEmail}`;

  return {
    subject,
    html,
    text,
  };
};
