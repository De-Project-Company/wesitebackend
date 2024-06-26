import nodemailer from "nodemailer";
import { BadRequestError } from "../middlewares";

const { SMTP_EMAIL, SMTP_PASSWORD } = process.env;

const Sendmail = async (emailcontent: any) => {
  const transporter = nodemailer.createTransport({
    host: "premium3.web-hosting.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail(emailcontent);
    console.log("Email sent successfully.");
    return { message: "Email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new BadRequestError("Error sending email");
  }
};

export { Sendmail };
