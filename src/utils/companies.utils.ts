import bcrypt from "bcrypt";
import { prisma } from "../server";
import { sendVerificationEmail } from "../services/resend";

export const createCompany = async (
  name: string,
  address: string,
  email: string,
  phone: string,
  password: string
) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const company = await prisma.company.create({
    data: {
      name: name,
      address: address,
      email: email,
      phone: phone,
      password: hashedPassword,
      salt: salt,
    },
  });

  const response = {
    id: company.id,
    name: company.name,
    address: company.address,
    email: company.email,
    phone: company.phone,
  };

  await sendVerificationEmail(email, company.id, company.name);

  return response;
};
