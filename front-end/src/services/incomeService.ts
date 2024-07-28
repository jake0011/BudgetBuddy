import axios from "@/utils/axios"; // Importing axios instance
import {
  getExpenditureCategories,
  getUserExpenses,
  getUserRecentExpenses,
} from "@/services/expenditureService"; // Importing functions from expenditureService
import { getGoals } from "@/services/goalsService"; // Importing function from goalsService
import { getMonthName } from "@/helpers/monthConverter"; // Importing function to convert month number to month name

// Function to get income data for a specific user and month
export const getIncome = async (
  userId: string,
  month: number,
  year: number
) => {
  const monthOfTheYear = getMonthName(month); // Convert month number to month name
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

    return response.data.data; // Return the income data
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to add income data for a specific user
export const addIncome = async (
  userId: string,
  month: number,
  year: number,
  amount: number,
  source: string
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required"); // Throw error if userId is not provided
    }
    const monthOfTheYear = getMonthName(month); // Convert month number to month name
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

    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to update income data for a specific user
export const updateIncome = async (
  userId: string,
  incomesId: string,
  amount: number,
  source: string,
  month: number,
  year: number
) => {
  try {
    const monthOfTheYear = getMonthName(month); // Convert month number to month name
    const response = await axios.patch(
      `/auth/v1/income/update`,
      {
        incomesId,
        amount,
        source,
        monthOfTheYear,
        year,
      },
      {
        headers: {
          userId,
        },
      }
    );

    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to get summary data for a specific user and month
export const getSummaryData = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    // Fetch income, expenses, recent expenses, goals, and categories concurrently
    const [income, expenses, recentExpenses, goals, categories] =
      await Promise.all([
        getIncome(userId, month, year),
        getUserExpenses(userId, month, year),
        getUserRecentExpenses(userId),
        getGoals(userId),
        getExpenditureCategories(),
      ]);

    // Map recent expenses to include category names
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
    throw error; // Throw error if request fails
  }
};

// Function to get report data for a specific user and month
export const getReportData = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    // Fetch income, expenses, goals, and categories concurrently
    const [income, expenses, goals, categories] = await Promise.all([
      getIncome(userId, month, year),
      getUserExpenses(userId, month, year),
      getGoals(userId),
      getExpenditureCategories(),
    ]);

    // Group expenses by category
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
    throw error; // Throw error if request fails
  }
};

// Function to delete income data for a specific user
export const deleteIncome = async (userId: string, incomesId: string) => {
  try {
    const response = await axios.delete(`/auth/v1/income/delete`, {
      headers: {
        userId: userId,
      },
      data: {
        incomesId,
      },
    });

    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};
