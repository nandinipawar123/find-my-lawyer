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
  
  // Remove all non-numeric characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add it
  if (!cleaned.startsWith('+')) {
    // If it starts with 91 but no +, add +
    if (cleaned.startsWith('91') && cleaned.length > 10) {
      cleaned = '+' + cleaned;
    } else {
      // Otherwise assume it's a 10-digit Indian number and add +91
      // Strip leading 0 if present
      cleaned = cleaned.replace(/^0/, '');
      cleaned = '+91' + cleaned;
    }
  }
  
  return cleaned;
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
    // FALLBACK TO MOCK OTP IF TWILIO FAILS (Trial limit, unverified number, etc)
    console.log(`[FALLBACK OTP] Twilio failed. Use Mock OTP 123456 for ${formattedPhone}`);
    return { status: 'mocked' };
  }
};

const verifyOtpCode = async (phone, code) => {
  const formattedPhone = formatPhoneNumber(phone);
  
  // Always allow mock OTP for testing
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
