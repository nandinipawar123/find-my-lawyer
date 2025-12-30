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
    throw new Error('Twilio not configured');
  }

  try {
    const verification = await client.verify.v2.services(verifyServiceSid)
      .verifications
      .create({ to: formattedPhone, channel: 'sms' });
    return verification;
  } catch (error) {
    console.error('Twilio Error:', error.message);
    throw error;
  }
};

const verifyOtpCode = async (phone, code) => {
  const formattedPhone = formatPhoneNumber(phone);

  if (!client || !verifyServiceSid) {
    throw new Error('Twilio not configured');
  }

  try {
    const verificationCheck = await client.verify.v2.services(verifyServiceSid)
      .verificationChecks
      .create({ to: formattedPhone, code });
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Twilio Verify Error:', error.message);
    throw error;
  }
};

module.exports = { sendOtp, verifyOtpCode };
