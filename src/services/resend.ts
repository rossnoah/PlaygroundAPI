import { Resend } from "resend";
import dotenv from "dotenv";
import { FQDN, serviceName } from "../server";
dotenv.config();
const RESEND_KEY = process.env.RESEND_KEY;
const resend = new Resend(RESEND_KEY);

export const sendVerificationEmail = async (
  email: string,
  id: string,
  name: string
) => {
  try {
    const data = await resend.emails.send({
      from: `${serviceName} <noreply@${FQDN}.com>`,
      to: [email],
      subject: "Verify your email",
      html: `Welcome to ${serviceName}, ${name}!
      <a href="http://localhost:3000/verify/${id}">Verify your email</a>`,
    });

    // console.log(data);
    return true;
  } catch (error) {
    console.error("Resend Email", error);
    return false;
  }
};
