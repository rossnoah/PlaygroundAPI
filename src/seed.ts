import { prisma } from "./server";
import bcrypt from "bcrypt";
import { createCompany } from "./utils/companies.utils";

export const seedProductCategories = async () => {
  if (await prisma.productCatagory.findFirst()) {
    return console.log("Product Categories already seeded");
  }

  await prisma.productCatagory.createMany({
    data: [
      {
        name: "Umbrellas",
        description: "Tucci, Outdoor Classics, Treasure Garden",
      },
      {
        name: "Outdoor Classics",
        description: "Outdoor Patio Furniture",
      },
      {
        name: "Game Tables",
        description: "Pool Tables, Foosball Tables, Air Hockey Tables",
      },
    ],
  });
  console.log("Product Categories seeded");
};

export const seedDeliveryMethods = async () => {
  if (await prisma.deliveryMethod.findFirst()) {
    return console.log("Delivery Methods already seeded");
  }

  await prisma.deliveryMethod.createMany({
    data: [
      {
        name: "UPS",
        price: 0,
        alwaysTax: false,
      },
      {
        name: "White Glove",
        price: 100,
        alwaysTax: true,
      },
      {
        name: "In Store",
        price: 0,
        alwaysTax: true,
      },
    ],
  });
  console.log("Delivery Methods seeded");
};

export const seedCompanies = async () => {
  if (await prisma.company.findFirst()) {
    return console.log("Companies already seeded");
  }

  await createCompany(
    "Patio.com",
    "58 Largo Drive, Stamford, CT 06907",
    "noahwross+patioware@gmail.com",
    "+14154505085",
    "password"
  );

  console.log("Default company seeded");
};
