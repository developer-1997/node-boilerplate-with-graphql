const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // 1) create a transporter
  console.log(process.env.EMAIL_USERNAME);
  var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Define mail options
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: option.email,
    subject: option.subject,
    text: option.message,
    //html
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
