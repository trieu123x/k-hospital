import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key_for_testing");

if (!process.env.RESEND_API_KEY) {
  console.error("Email configuration warning: Thiếu biến môi trường RESEND_API_KEY");
} else {
  console.log("Email server (Resend) is ready");
}

export const sendOtpEmail = async (toEmail, otp) => {
    // Nếu chưa cấu hình domain tuỳ chỉnh trên Resend, hệ thống sẽ mặc định dùng địa chỉ này:
    const sender = process.env.RESEND_DOMAIN ? `MediAssist <${process.env.RESEND_DOMAIN}>` : "MediAssist <onboarding@resend.dev>";
    
    const { data, error } = await resend.emails.send({
        from: sender,
        to: toEmail,
        subject: "Mã OTP đặt lại mật khẩu",
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 480px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px;">
                <h2 style="color: #1a73e8;">MediAssist - Đặt lại mật khẩu</h2>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                <p>Mã OTP của bạn là:</p>
                <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a73e8; text-align: center; padding: 16px; background: #f0f4ff; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="margin-top: 16px; color: #555;">Mã có hiệu lực trong <strong>10 phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
                <p style="color: #999; font-size: 12px;">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
            </div>
        `
    });

    if (error) {
        console.error("Lỗi gửi email bằng Resend:", error);
    }
};
