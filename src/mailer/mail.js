require("dotenv/config");
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  port: process.env.NODEMAILER_PORT,
  secure: process.env.NODEMAILER_SECURE,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

const invitationMail = async (email, inviteLink) => {
  await transporter.sendMail({
    from: "janakiraman12345678900@outlook.com",
    to: email,
    subject: "Invitation to access application",
    text: `Good day .Infoskies sent you an invite.`,
    html: `<div><p style="color:blue;font-size:46px;background-color:black;color:white">Good day .Infoskies sent you an invite.
      Please click below link .</p>
     <a href="url" style="color:blue;font-size:2rem">${inviteLink}</a>
     </div>`,
  });
};

const forgotPasswordMail = async (email, inviteLink) => {
  await transporter.sendMail({
    from: "janakiraman12345678900@outlook.com",
    to: email,
    subject: "Link to reset password",
    text: `Good day .Infoskies sent you a link for password resetting`,
    html: `<div><p style="color:blue;font-size:46px;background-color:black;color:white">Good day .Infoskies sent you an invite.
     Use the below link to reset password.</p>
     <a href="url" style="color:blue;font-size:2rem">${inviteLink}</a>
     </div>`,
  });
};

module.exports = { invitationMail, forgotPasswordMail };
