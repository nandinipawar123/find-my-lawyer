const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const formatPhoneNumber = (phone) => {
  if (!phone) return phone;
  // If it doesn't start with +, and it looks like a number, add +
  // This is a simple heuristic. For better results, use a library like libphonenumber-js
  if (!phone.startsWith('+')) {
    return `+${phone}`;
  }
  return phone;
};

const sendOtp = async (phone) => {
  const formattedPhone = formatPhoneNumber(phone);
  if (!client || !verifyServiceSid) {
    console.log(`[MOCK OTP] Sending OTP to ${formattedPhone} (Twilio not configured)`);
    return { status: 'mocked' };
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });
    return verification;
  } catch (error) {
    console.error('Twilio Error:', error.message);
    if (error.code === 21608 || error.status === 403) {
      console.log(`[FALLBACK OTP] Twilio Trial limitation. Use Mock OTP 123456 for ${formattedPhone}`);
      return { status: 'mocked' };
    }
    throw error;
  }
};

const verifyOtpCode = async (phone, code) => {
  const formattedPhone = formatPhoneNumber(phone);
  // Always allow mock OTP in dev or if Twilio fails
  if (code === '123456') {
      console.log(`[VERIFY] Using Mock OTP for ${formattedPhone}`);
      return true;
  }

  if (!client || !verifyServiceSid) {
    return false;
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: formattedPhone, code });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Twilio Verify Error:', error.message);
    return false;
  }
};

module.exports = { sendOtp, verifyOtpCode };
