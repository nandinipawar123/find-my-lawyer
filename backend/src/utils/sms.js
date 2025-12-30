const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
}

const sendOtp = async (phone) => {
  if (!client || !verifyServiceSid) {
    console.log(`[MOCK OTP] Sending OTP to ${phone} (Twilio not configured)`);
    return { status: 'mocked' };
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: phone, channel: 'sms' });
    return verification;
  } catch (error) {
    console.error('Twilio Error:', error);
    throw error;
  }
};

const verifyOtpCode = async (phone, code) => {
  if (!client || !verifyServiceSid) {
    console.log(`[MOCK OTP] Verifying OTP ${code} for ${phone} (Twilio not configured)`);
    return code === '123456';
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: phone, code });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Twilio Error:', error);
    throw error;
  }
};

module.exports = { sendOtp, verifyOtpCode };
