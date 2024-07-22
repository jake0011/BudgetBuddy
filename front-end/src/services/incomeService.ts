import axios from "@/utils/axios";
import {
  getExpenditureCategories,
  getUserExpenses,
  getUserRecentExpenses,
} from "@/services/expenditureService";
import { getGoals } from "@/services/goalsService";

export const getIncome = async (userId: string) => {
  try {
    const response = await axios.get("/auth/v1/income/all", {
      headers: {
        userId,
      },
    });

    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getSummaryData = async (userId: string) => {
  try {
    const [income, expenses, recentExpenses, goals, categories] =
      await Promise.all([
        getIncome(userId),
        getUserExpenses(userId),
        getUserRecentExpenses(userId),
        getGoals(userId),
        getExpenditureCategories(),
      ]);

    // Map categories to recent expenses
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

export const getReportData = async (userId: string) => {
  try {
    const [income, expenses, goals, categories] = await Promise.all([
      getIncome(userId),
      getUserExpenses(userId),
      getGoals(userId),
      getExpenditureCategories(),
    ]);

    // Sum expenses by category
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

    // Convert expensesByCategory to an array
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
