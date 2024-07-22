import axios from "@/utils/axios";
import {
  getExpenditureCategories,
  getUserExpenses,
  getUserRecentExpenses,
} from "@/services/expenditureService";
import { getGoals } from "@/services/goalsService";
import { getMonthName } from "@/helpers/monthConverter";

export const getIncome = async (
  userId: string,
  month: number,
  year: number
) => {
  const monthOfTheYear = getMonthName(month);
  try {
    const response = await axios.post(
      "/auth/v1/income/month",
      {
        monthOfTheYear,
        year,
      },
      {
        headers: {
          userId,
        },
      }
    );

    return response.data.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addIncome = async (
  userId: string,
  month: number,
  year: number,
  amount: number,
  source: string
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const monthOfTheYear = getMonthName(month);
    const response = await axios.post(
      "/auth/v1/income/add",
      {
        source,
        amount,
        monthOfTheYear,
        year,
      },
      {
        headers: {
          userId,
        },
      }
    );

    return response.data.message;
  } catch (error) {
    throw error;
  }
};

export const getSummaryData = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    const [income, expenses, recentExpenses, goals, categories] =
      await Promise.all([
        getIncome(userId, month, year),
        getUserExpenses(userId, month, year),
        getUserRecentExpenses(userId),
        getGoals(userId),
        getExpenditureCategories(),
      ]);

    const recentExpensesWithNames = recentExpenses.map((expense) => {
      const category = categories.find(
        (cat) => cat.categoriesId === expense.categoriesId
      );
      return {
        ...expense,
        categoryName: category ? category.name : "Unknown",
      };
    });

    return {
      income,
      expenses,
      recentExpenses: recentExpensesWithNames,
      goals,
    };
  } catch (error) {
    throw error;
  }
};

export const getReportData = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    const [income, expenses, goals, categories] = await Promise.all([
      getIncome(userId, month, year),
      getUserExpenses(userId, month, year),
      getGoals(userId),
      getExpenditureCategories(),
    ]);

    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = categories.find(
        (cat) => cat.categoriesId === expense.categoriesId
      );
      const categoryName = category ? category.name : "Unknown";

      if (!acc[categoryName]) {
        acc[categoryName] = {
          categoryName,
          amount: 0,
          expenses: [],
        };
      }

      acc[categoryName].amount += expense.amount;
      acc[categoryName].expenses.push(expense);

      return acc;
    }, {});

    const expensesArray = Object.values(expensesByCategory);

    return {
      income,
      expenses: expensesArray,
      goals,
    };
  } catch (error) {
    throw error;
  }
};
