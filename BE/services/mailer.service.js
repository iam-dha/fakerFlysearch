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
        <li><strong>Status:</strong> ${booking.payment_status}</li>
      </ul>
      <p>You can view your bookings in the app at any time.</p>
      <br>
      <p>Thank you,<br>The FlySearchApp Team</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendCarBookingConfirmation = async (to, booking, route) => {
  const mailOptions = {
    from: `"FlySearchApp Support" <${process.env.MAIL_USER}>`,
    to,
    subject: "🚐 Car Booking Confirmation",
    html: `
      <h2>🚐 Car Booking Confirmed</h2>
      <p>You've successfully booked a shuttle service:</p>
      <ul>
        <li><strong>Route:</strong> ${route.from} → ${route.to}</li>
        <li><strong>Date:</strong> ${new Date(route.departure_date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${route.departure_time}</li>
        <li><strong>Service:</strong> ${route.type}</li>
        <li><strong>Seats:</strong> ${booking.seats}</li>
        <li><strong>Status:</strong> ${booking.payment_status}</li>
      </ul>
      <p>Thank you for using FlySearchApp.</p>
    `,
  };
  await transporter.sendMail(mailOptions);
};

const sendHotelBookingConfirmation = async (to, booking, hotel) => {
  const nights = Math.ceil((new Date(booking.check_out) - new Date(booking.check_in)) / (1000 * 60 * 60 * 24));

  const roomDetails = booking.rooms.map(
    (r) => `<li>${r.quantity}x ${r.room.type}</li>`
  ).join("");

  const mailOptions = {
    from: `"FlySearchApp Support" <${process.env.MAIL_USER}>`,
    to,
    subject: "🏨 Hotel Booking Confirmation - FlySearchApp",
    html: `
      <h2>🏨 Hotel Booking Confirmed!</h2>
      <p>You've successfully booked a hotel room:</p>
      <ul>
        <li><strong>Hotel:</strong> ${hotel.name}</li>
        <li><strong>Address:</strong> ${hotel.address}</li>
        <li><strong>Check-in:</strong> ${new Date(booking.check_in).toLocaleDateString()}</li>
        <li><strong>Check-out:</strong> ${new Date(booking.check_out).toLocaleDateString()}</li>
        <li><strong>Nights:</strong> ${nights}</li>
        <li><strong>Rooms:</strong> <ul>${roomDetails}</ul></li>
        <li><strong>Status:</strong> ${booking.payment_status}</li>
      </ul>
      <p>You can manage your bookings in the app.</p>
      <br>
      <p>Thank you,<br>FlySearchApp Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports.sendOtpEmailRegister = sendOtpEmailRegister;
module.exports.sendOtpEmailChange = sendOtpEmailChange;
module.exports.sendEmailForgotPassword = sendEmailForgotPassword;
module.exports.sendBookingConfirmation = sendBookingConfirmation;
module.exports.sendCarBookingConfirmation = sendCarBookingConfirmation;
module.exports.sendHotelBookingConfirmation = sendHotelBookingConfirmation;