const forgotPasswordTemplate = ({ name, otp }) => {
  return `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px;">
    <h2 style="color: #d9534f;">Xin chào ${name},</h2>
    <p>Bạn vừa gửi yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
    <p>Vui lòng sử dụng mã OTP dưới đây để xác minh và tiếp tục đặt lại mật khẩu:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; background: #f0c808; color: #000; font-size: 22px; font-weight: bold; letter-spacing: 3px; padding: 12px 25px; border-radius: 6px;">
        ${otp}
      </span>
    </div>
    <p><b>Lưu ý:</b> Mã OTP có hiệu lực trong <span style="color: #d9534f;">60 phút</span>. Vui lòng không chia sẻ mã này với bất kỳ ai.</p>
    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
    <br/>
    <p>Trân trọng,</p>
    <p><b>Đội ngũ hỗ trợ PizzaTP</b></p>
  </div>
  `;
};

export default forgotPasswordTemplate;
