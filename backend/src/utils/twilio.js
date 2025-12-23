const twilio = require('twilio');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const from = process.env.TWILIO_PHONE_NUMBER;

exports.sendOTP = async (to) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  await client.messages.create({
    body: `Your OTP is: ${otp}`,
    from,
    to
  });
  // Store OTP in-memory or use Redis for production
  global.otpStore = global.otpStore || {};
  global.otpStore[to] = otp;
  setTimeout(() => delete global.otpStore[to], 5 * 60 * 1000); // 5 min expiry
  return otp;
};

exports.verifyOTP = async (to, otp) => {
  return global.otpStore && global.otpStore[to] === otp;
};
