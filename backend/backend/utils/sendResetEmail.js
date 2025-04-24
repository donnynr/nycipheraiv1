async function sendResetEmail(email, token) {
    const resetUrl = `https://yourdomain.com/reset-password?token=${token}`;
    console.log(`[Simulated Email] Send to ${email}: ${resetUrl}`);
    // Use nodemailer/sendgrid/etc.
  }
  module.exports = sendResetEmail;
  