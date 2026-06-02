/** Chuyển lỗi Supabase Auth sang tiếng Việt dễ hiểu. */
export function toAuthErrorMessage(message: string): string {
  const msg = message.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng.";
  }
  if (msg.includes("email not confirmed")) {
    return "Email chưa xác nhận. Mở hộp thư (cả thư rác), bấm link xác nhận, hoặc tắt Confirm email trong Supabase → Authentication → Providers → Email.";
  }
  if (msg.includes("user already registered")) {
    return "Email này đã được đăng ký. Hãy đăng nhập.";
  }
  if (msg.includes("password should be at least")) {
    return "Mật khẩu quá ngắn. Supabase yêu cầu tối thiểu 6 ký tự.";
  }
  if (msg.includes("unable to validate email")) {
    return "Email không hợp lệ.";
  }
  if (msg.includes("signup is disabled")) {
    return "Đăng ký đang tắt trên Supabase. Bật lại trong Authentication → Providers → Email.";
  }

  return message;
}
