const nodemailer = require("nodemailer");

const sendEmail = async (option) => {
  // 1) create a transporter
  console.log(process.env.EMAIL_USERNAME);

  var transporter = nodemailer.createTransport({
    host: "smtp.sendgrid.net",
    port: 25,
    auth: {
      user: process.env.SENDGRID_USERNAME,
      pass: process.env.SENDGRID_PASSWORD,
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
