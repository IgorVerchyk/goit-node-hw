const sgMail = require("@sendgrid/mail");
const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  #createTemplate(verificationToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "default",
      product: {
        name: "System contacts",
        link: "http://localhost:3000/",
      },
    });
    const template = {
      body: {
        name,
        intro:
          "Welcome to System contacts! We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with System contacts, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `http://localhost:3000/api/users/auth/verify/${verificationToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    const emailBody = mailGenerator.generate(template);
    return emailBody;
  }

  async sendEmail(verificationToken, email, name) {
    const emailBody = this.#createTemplate(verificationToken, name);
    sgMail.setApiKey(process.env.GRID_KEY);
    const msg = {
      to: email,
      from: "noreply@system-contacts.com",
      subject: "Sending with SendGrid is Fun",
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
