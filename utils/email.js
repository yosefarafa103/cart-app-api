const nodemailer = require("nodemailer");
const pug = require("pug");
const htmlToText = require("html-to-text");
module.exports = class Email {
  constructor(user, url) {
    this.user = user;
    this.sendFrom = "Yosef";
    this.to = user.email;
    this.redirectPage = url;
  }
 

  transport() {
    return nodemailer.createTransport({
      host: process.env.MAILGUN_HOST,
      port: process.env.MAILGUN_PORT,
      auth: {
        user: process.env.MAILGUN_USERNAME,
        pass: process.env.MAILGUN_PASS,
      },
    });
  }

  //
  async sendEmail(template, emailSubject) {
    // console.log(this.user);

    const htmlTem = pug.renderFile(
      `${__dirname}/../view/emails/${template}.pug`,
      {
        subject: emailSubject,
        userInfo: this.user,
        url: this.redirectPage,
      }
    );
    console.log(htmlTem);
    await this.transport().sendMail({
      from: this.sendFrom,
      to: this.to,
      subject: emailSubject,
      html: htmlTem,
      // text: emailSubject,
    });
  }
};

// const sendMail = async (emailOptions) => {
//   const { reciveMail, message } = emailOptions;
//   // transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.MAILTRAP_HOST,
//     port: process.env.MAILTRAP_PORT,
//     auth: {
//       user: process.env.MAILTRAP_EMAIL,
//       pass: process.env.MAILTRAP_PASSWORD,
//     },
//   });
//   const options = {
//     from: "Yosef.A",
//     to: reciveMail,
//     subject: "Verify Email (reset password)",
//     text: message,
//   };
//   await transporter.sendMail(options);
// };
// module.exports = sendMail;
