const nodemailer = require("nodemailer");
const systemConfig = require("../config/system");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendOtpEmailRegister = async (to, otp) => {
    const mailOptions = {
        from: `"FlySearchApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        html: `
          <h2>🔐 Your OTP Code</h2>
          <p>Here is your OTP code to register: <b>${otp}</b></p>
          <p>This code will expire in ${systemConfig.otpExpiration} minutes.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendOtpEmailChange = async (to, otp) => {
    const mailOptions = {
        from: `"FlySearchApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Email Change Verification Code",
        html: `
          <h2>✉️ Verify Your New Email Address</h2>
          <p>We received a request to change your email address.</p>
          <p>Please enter the following OTP code to confirm this change:</p>
          <h3 style="color: #2e86de;">${otp}</h3>
          <p>This code will expire in ${systemConfig.otpExpiration} minutes. If you did not request this, please ignore this email.</p>
          <br>
          <p>Thank you,<br>The FlySearchApp Team</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendEmailForgotPassword = async (to, resetUrl) => {
    const mailOptions = {
        from: `"FlySearchApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Password Reset Request",
        html: `
          <h2>🔒 Password Reset Request</h2>
          <p>We received a request to reset your password.</p>
          <p>Please click the link below to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in ${systemConfig.passwordResetExpiration.inNumber} minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
          <br>
          <p>Thank you,<br>The FlySearchApp Team</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

const sendBookingConfirmation = async (to, booking) => {
    const flight = booking.flight;
    const mailOptions = {
        from: `"FlySearchApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "✈️ Booking Confirmation - FlySearchApp",
        html: `
          <h2>🛫 Booking Confirmed!</h2>
          <p>Thank you for booking your flight with FlySearchApp.</p>
          <ul>
            <li><strong>Route:</strong> ${flight.iata_from} → ${flight.iata_to}</li>
            <li><strong>Date:</strong> ${new Date(flight.departure_date).toLocaleDateString()}</li>
            <li><strong>Time:</strong> ${flight.departure_time}</li>
            <li><strong>Seat class:</strong> ${booking.seat_class}</li>
            <li><strong>Passenger:</strong> ${booking.passenger_name}</li>
            <li><strong>Status:</strong> ${booking.payment_status}</li>
          </ul>
          <p>You can view your bookings in the app at any time.</p>
          <br>
          <p>Thank you,<br>The FlySearchApp Team</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports.sendOtpEmailRegister = sendOtpEmailRegister;
module.exports.sendOtpEmailChange = sendOtpEmailChange;
module.exports.sendEmailForgotPassword = sendEmailForgotPassword;

module.exports.sendBookingConfirmation = sendBookingConfirmation;
