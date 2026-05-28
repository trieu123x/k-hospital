import { supabase, supabaseAdmin } from "../configs/supabase-config.js";
import { profileRepository } from "../repositories/auth.js";
import { uploadHelper } from "../helpers/storage-helper.js";
import { formatPhoneE164 } from "../helpers/string-format.js";

export const authService = {
  registerDoctor: async ({ email, fullName, phone, file, avatarCropData }) => {
    // 1. Phòng thủ trùng lặp Email & Số điện thoại
    const formattedPhone = formatPhoneE164(phone);

    // 2. Phòng thủ trùng lặp Email & Số điện thoại (dùng số đã chuẩn hóa)
    if (email) {
      const existingEmail = await profileRepository.findByEmail(email);
      if (existingEmail) throw Object.assign(new Error("Email đã được sử dụng"), { statusCode: 409 });
    }

    if (formattedPhone) {
      const existingPhone = await profileRepository.findByPhone(formattedPhone); // Tìm theo +84...
      if (existingPhone) throw Object.assign(new Error("Số điện thoại đã được sử dụng"), { statusCode: 409 });
    }

    if (!supabaseAdmin) throw Object.assign(new Error("Cần cấu hình SUPABASE_SERVICE_ROLE_KEY"), { statusCode: 500 });

    const userPayload = {
      password: "medicare",
      user_metadata: { full_name: fullName, phone: formattedPhone, role: "DOCTOR" },
      email_confirm: true,
      phone_confirm: true,
    };

    if (email && email.trim() !== "") {
      userPayload.email = email.trim();
    }

    if (formattedPhone) {
      userPayload.phone = formattedPhone;
    }

    // 2. Đẩy thông tin lên Supabase 
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser(userPayload);

    if (authError) throw Object.assign(new Error(authError.message), { statusCode: 400 });
    const userId = authData.user?.id;

    // 3. Xử lý phần nghiệp vụ mở rộng (Upload ảnh & tạo quan hệ bảng phụ)
    try {
      let avatarUrl = null;
      if (file) {
        avatarUrl = await uploadHelper.uploadFile(file, 'medicare', 'users');
      }

      // Khởi tạo bảng doctors, liên kết trực tiếp với Profile DOCTOR vừa đẻ ra
      const profile = await profileRepository.initDoctor({
        id: userId,
        avatarUrl,
        avatarCropData: avatarCropData ? JSON.parse(avatarCropData) : null
      });

      return {
        userId: profile.id,
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        role: "DOCTOR",
        avatarUrl: profile.avatarUrl
      };

    } catch (error) {
      // Cơ chế Rollback tự động dọn rác nếu luồng lưu file/bảng phụ lỗi
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw Object.assign(new Error("Lỗi hệ thống khi hoàn tất hồ sơ bác sĩ: " + error.message), { statusCode: 500 });
    }
  },

  /**
   * Bệnh nhân tự đăng ký tài khoản mới 
   */
  register: async ({ email, password, fullName, phone }) => {
    // 1. Kiểm tra trùng lặp thông tin
    const formattedPhone = formatPhoneE164(phone);
    const existingPhone = await profileRepository.findByPhone(formattedPhone);
    if (existingPhone) throw Object.assign(new Error("Số điện thoại đã được sử dụng"), { statusCode: 409 });

    const existingEmail = await profileRepository.findByEmail(email);
    if (existingEmail) throw Object.assign(new Error("Email đã được sử dụng"), { statusCode: 409 });

    // 3. Đăng ký qua Supabase
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone: formattedPhone, role: "PATIENT" },
      },
    });

    if (error) throw Object.assign(new Error(`Lỗi đăng ký: ${error.message}`), { statusCode: 400 });

    return {
      email,
      message: "Vui lòng kiểm tra hộp thư email và bấm vào link để kích hoạt tài khoản."
    };
  },

  /**
   * Đăng nhập 
   */
  login: async ({ email, password }) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) throw Object.assign(new Error("Email hoặc mật khẩu không đúng"), { statusCode: 401 });

    const userId = authData.user?.id;
    const profile = await profileRepository.findById(userId);

    if (!profile) throw Object.assign(new Error("Tài khoản không tồn tại trên hệ thống"), { statusCode: 404 });
    if (profile.isActive === false) throw Object.assign(new Error("Tài khoản của bạn đã bị khóa."), { statusCode: 403 });

    return {
      accessToken: authData.session.access_token,
      refreshToken: authData.session.refresh_token,
      expiresIn: authData.session.expires_in,
      user: {
        userId: profile.id,
        fullName: profile.fullName,
        phone: profile.phone,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        email: authData.user.email
      },
    };
  },

  logout: async (accessToken) => {
    const { error } = await supabase.auth.admin.signOut(accessToken);
    if (error) throw Object.assign(new Error("Đăng xuất thất bại"), { statusCode: 500 });
    return true;
  },

  getMe: async (userId) => {
    const profile = await profileRepository.findById(userId);
    if (!profile) throw Object.assign(new Error("Không tìm thấy người dùng"), { statusCode: 404 });
    return profile;
  },

  forgotPassword: async ({ email }) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw Object.assign(new Error(`Không thể gửi yêu cầu: ${error.message}`), { statusCode: 400 });
    return { message: "Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi đến bạn." };
  },

  resetPassword: async ({ email, otp, newPassword }) => {
    const { error: verifyError } = await supabase.auth.verifyOtp({ email, token: otp, type: 'recovery' });
    if (verifyError) throw Object.assign(new Error("Mã OTP không hợp lệ hoặc đã hết hạn"), { statusCode: 400 });

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) throw Object.assign(new Error(`Lỗi cập nhật: ${updateError.message}`), { statusCode: 400 });

    await supabase.auth.signOut();
    return { message: "Đặt lại mật khẩu thành công!" };
  },
};