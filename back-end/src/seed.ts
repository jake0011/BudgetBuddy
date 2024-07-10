import { db } from "./db/db.ts";
import { users } from "./db/schema/users.ts";
import { expenditures } from "./db/schema/expenditures.ts";
import { incomes } from "./db/schema/incomes.ts";
import { categories } from "./db/schema/expenditures.ts";
import { goals } from "./db/schema/goals.ts";

async function seed() {
  //TODO: Don't forget to catch these types of errors when it comes to the actual
  //implementation
  await db.insert(users).values([
    {
      username: "kwabenadarkwa",
      firstname: "Kwabena",
      middlename: "Darkwa",
      lastname: "Obeng-Yeboah",
      password: await Bun.password.hash("catchoneboyandslapam", {
        algorithm: "bcrypt",
        cost: 4,
      }),
      email: "darkwak@live.com",
    },
    {
      username: "edemakuaku",
      firstname: "Jonathan",
      middlename: "Edem",
      lastname: "Akuaku",
      password: await Bun.password.hash("catchboyoneandslapam", {
        algorithm: "bcrypt",
        cost: 4,
      }),
      email: "edem@live.com",
    },
    {
      username: "mrryt",
      firstname: "Flavio",
      lastname: "Sobbin",
      password: await Bun.password.hash("jsisthegoat", {
        algorithm: "bcrypt",
        cost: 4,
      }),
      email: "flavio@live.com",
    },
    {
      username: "owulo onions",
      firstname: "Alan",
      lastname: "Perry",
      password: await Bun.password.hash("lifeofacomrade", {
        algorithm: "bcrypt",
        cost: 4,
      }),
      email: "onions@live.com",
    },
  ]);

  const userRows = await db.select().from(users);
  const userIds = userRows.map((row) => row.userId);
  const categoriesRows = await db.select().from(categories);
  const categoriesIds = categoriesRows.map((row) => row.categoriesId);

  await db.insert(categories).values([
    {
      name: "Housing",
      description:
        "Expenses related to where you live, such as rent, mortgage payments, property taxes, and maintenance costs.",
    },
    {
      name: "Transportation",
      description:
        "Costs associated with getting around, including car payments, gas, insurance, public transportation fares, and ride-sharing services.",
    },
    {
      name: "Food",
      description:
        "Expenses related to purchasing and consuming food and beverages, including groceries, dining out, and takeout.",
    },
    {
      name: "Utilities",
      description:
        "Bills for essential services like gas, water, electricity, sewage, air conditioning, internet, and cell phone plans.",
    },
    {
      name: "Insurance",
      description: "Protection plans for your health, home, car, and life.",
    },
    {
      name: "Healthcare",
      description:
        "Expenses related to maintaining your health, such as doctor visits, hospital stays, prescription medications, and other medical treatments.",
    },
    {
      name: "Saving, Investing and Debt Payment",
      description:
        "Setting aside money for the future, growing your wealth through investments, and paying off outstanding debts.",
    },
    {
      name: "Personal Spending",
      description:
        "Costs for personal items and services like gym memberships, clothing, home decor, and gifts.",
    },
    {
      name: "Recreation and Entertainment",
      description:
        "Money spent on leisure activities such as concerts, sporting events, family outings, vacations, streaming services, restaurants, video games, and hobbies.",
    },
    {
      name: "Education",
      description:
        "Costs related to learning, such as online courses, college tuition (undergraduate and graduate), and other educational expenses.",
    },
    {
      name: "miscellaneous",
      description:
        "Expenses that do not fit into any of the other categories, or for unexpected costs that may arise.",
    },
  ]);

  await db.insert(incomes).values([
    {
      amount: 35.23,
      userId: userIds[0],
      categoriesId: categoriesIds[0],
      monthOfTheYear: "June",
      year: "2003",
    },
    {
      amount: 350.23,
      userId: userIds[1],
      categoriesId: categoriesIds[9],
      monthOfTheYear: "June",
      year: "2003",
    },
    {
      amount: 1832.24,
      userId: userIds[2],
      categoriesId: categoriesIds[7],
      monthOfTheYear: "June",
      year: "2013",
    },
    {
      amount: 7350.29,
      userId: userIds[3],
      categoriesId: categoriesIds[3],
      monthOfTheYear: "June",
      year: "2023",
    },
  ]);

  await db.insert(expenditures).values([
    {
      amount: 34.3,
      type: "budget",
      categoriesId: categoriesIds[0],
      userId: userIds[0],
    },
    {
      amount: 34.53,
      type: "expenses",
      categoriesId: categoriesIds[0],
      userId: userIds[0],
    },
    {
      amount: 34.3,
      type: "budget",
      categoriesId: categoriesIds[2],
      userId: userIds[1],
    },
    {
      amount: 34.53,
      type: "expenses",
      categoriesId: categoriesIds[3],
      userId: userIds[1],
    },
    {
      amount: 4.53,
      type: "expenses",
      categoriesId: categoriesIds[0],
      userId: userIds[2],
    },
    {
      amount: 34.39,
      type: "budget",
      categoriesId: categoriesIds[2],
      userId: userIds[2],
    },
    {
      amount: 77.53,
      type: "expenses",
      categoriesId: categoriesIds[3],
      userId: userIds[3],
    },
  ]);

  await db.insert(goals).values([
    {
      title: "RTX 5080",
      amount: 4000,
      description: "Get this as soon as possible",
    },
    {
      title: "RTX 4090 Ti",
      amount: 16000,
      description: "Get this as soon as possible",
      percentageToGoal: 0.004,
    },
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
