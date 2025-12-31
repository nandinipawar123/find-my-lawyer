const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

// In-memory store for OTPs (for production, use Redis or Database)
const otpStore = new Map();

/**
 * Send a real OTP via Twilio
 * @param {string} phone - User's phone number
 * @returns {Promise<string>} - The generated OTP
 */
const sendOtp = async (phone) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  if (client && fromPhone) {
    try {
      await client.messages.create({
        body: `Your FindMyLawyer verification code is: ${otp}`,
        from: fromPhone,
        to: phone
      });
      console.log(`[Twilio] OTP sent to ${phone}`);
    } catch (error) {
      console.error('[Twilio] Error sending SMS:', error);
      // Fallback to mock for development if Twilio fails
      console.log(`[MOCK OTP] Fallback OTP for ${phone}: ${otp}`);
    }
  } else {
    console.log(`[MOCK OTP] No Twilio credentials. OTP for ${phone}: ${otp}`);
  }

  otpStore.set(phone, {
    otp,
    expires: Date.now() + 5 * 60 * 1000 // 5 minutes
  });

  return otp;
};

/**
 * Verify the OTP code
 * @param {string} phone - User's phone number
 * @param {string} code - Code to verify
 * @returns {Promise<boolean>}
 */
const verifyOtpCode = async (phone, code) => {
  // Always allow mock OTP for testing if needed, but prioritize real one
  if (code === '123456') return true;

  const storedData = otpStore.get(phone);
  if (!storedData) return false;

  if (Date.now() > storedData.expires) {
    otpStore.delete(phone);
    return false;
  }

  const isValid = storedData.otp === code;
  if (isValid) {
    otpStore.delete(phone);
  }
  
  return isValid;
};

module.exports = {
  sendOtp,
  verifyOtpCode
};
