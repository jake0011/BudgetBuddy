import { db } from "./db/db.ts";
import { users } from "./db/schema/users.ts";
import { expenditures } from "./db/schema/expenditures.ts";
import { incomes } from "./db/schema/incomes.ts";
import { categories } from "./db/schema/expenditures.ts";

async function seed() {
  //TODO: Don't forget to catch these types of errors when it comes to the actual
  //implementation 
  await db.insert(users).values([
    {
      username: "kwabenadarkwa",
      firstname: "Kwabena",
      middlename: "Darkwa",
      lastname: "Obeng-Yeboah",
      password: "catchoneboyandslapam",
      email: "darkwak@live.com",
    },
    {
      username: "edemakuaku",
      firstname: "Jonathan",
      middlename: "Edem",
      lastname: "Akuaku",
      password: "catchoneboyandslapam",
      email: "edem@live.com",
    },
  ]);

  const userRows = await db.select().from(users);
  const userIds = userRows.map((row) => row.userId);

  await db.insert(incomes).values([
    {
      amount: 35.23,
      userId: userIds[0],
      monthOfTheYear: "June",
      year: "2003",
    },
    {
      amount: 350.23,
      userId: userIds[1],
      monthOfTheYear: "June",
      year: "2003",
    },
  ]);

  await db.insert(categories).values([
    {
      name: "Housing",
      description: "This invovles all bills that have to do with anything housing related including rents and paying out loans that have been taken out for the building of a particular house"
    },
    {
      name: "Transportation",
      description: "This involves any transportion cost"
    },
    {
      name: "Food",
      description: "Any cost that has to do with the buying of food stuff to cook"
    },
    {
      name: "Utilities",
      description: "This involves costs that range from water bill, electricity bill, sewage bill, airconditioning, internet expenses and cell phone bills"
    },
    {
      name: "Insurance",
      description: "This involves health insurance, homeowners insurance, auto insurance, life insurance and all other kinds"
    }

  ]);

  const categoriesRows = await db.select().from(categories);
  const categoriesIds = categoriesRows.map((row) => row.categoriesId);

  await db.insert(expenditures).values([
    {
      amount: 34.3,
      type: "budget",
      categoriesId: categoriesIds[0],
      userId: userIds[0]
    },
    {
      amount: 34.53,
      type: "expenses",
      categoriesId: categoriesIds[0],
      userId: userIds[0]
    },
    {
      amount: 34.3,
      type: "budget",
      categoriesId: categoriesIds[2],
      userId: userIds[1]
    },
    {
      amount: 34.53,
      type: "expenses",
      categoriesId: categoriesIds[3],
      userId: userIds[1]
    }
  ]);
}

async function main() {
  try {
    await seed();
    console.log("Seeding completed");
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}
main();
