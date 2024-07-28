import { getMonthName } from "@/helpers/monthConverter"; // Importing function to convert month number to month name
import axios from "@/utils/axios"; // Importing axios instance

// Function to get all expenditure categories
export const getExpenditureCategories = async () => {
  try {
    const response = await axios.get("/v1/expenditure/categories");
    return response.data.data; // Return the categories data
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to get user expenses for a specific month and year
export const getUserExpenses = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required"); // Throw error if userId is not provided
    }
    const monthOfTheYear = getMonthName(month); // Convert month number to month name
    const response = await axios.post(
      "/auth/v1/expenditure/month",
      {
        monthOfTheYear,
        year,
        type: "expenses",
      },
      {
        headers: {
          userId: userId,
        },
      }
    );
    return response.data.data; // Return the expenses data
  } catch (error) {
    console.error(error);
    throw error; // Throw error if request fails
  }
};

// Function to get user budget for a specific month and year
export const getUserBudget = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required"); // Throw error if userId is not provided
    }
    const monthOfTheYear = getMonthName(month); // Convert month number to month name
    const response = await axios.post(
      "/auth/v1/expenditure/month",
      { monthOfTheYear, year, type: "budget" },
      {
        headers: {
          userId: userId,
        },
      }
    );
    return response.data.data; // Return the budget data
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to get recent user expenses
export const getUserRecentExpenses = async (userId: string) => {
  try {
    const response = await axios.get("/auth/v1/expenditure/expenses/recent", {
      headers: {
        userId: userId,
      },
    });

    // Filter expenses to include only those with goals
    const filteredExpenses = response.data.data.filter(
      (expense) => expense.goals !== null
    );
    return filteredExpenses; // Return the filtered expenses
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to add a new expenditure for a specific user
export const addExpenditure = async (
  userId: string,
  expenditureData: {
    amount: number;
    month: number;
    year: number;
    type: string;
    categoriesId: number;
    goalsId?: number;
  }
) => {
  try {
    const monthOfTheYear = getMonthName(expenditureData.month); // Convert month number to month name

    const response = await axios.post(
      "/auth/v1/expenditure/add",
      {
        amount: expenditureData.amount,
        monthOfTheYear,
        year: expenditureData.year,
        type: expenditureData.type,
        categoriesId: expenditureData.categoriesId,
        ...(expenditureData.goalsId !== null && {
          goalsId: expenditureData.goalsId,
        }),
      },
      {
        headers: {
          userId: userId,
        },
      }
    );
    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to update an existing expenditure for a specific user
export const updateExpenditure = async (
  userId: string,
  expenditureId: number,
  expenditureData: {
    amount: number;
    categoriesId: number;
    goalsId?: number;
    month: number;
    year: number;
    type: string;
  }
) => {
  try {
    const monthOfTheYear = getMonthName(expenditureData.month); // Convert month number to month name
    const response = await axios.put(
      `/auth/v1/expenditure/update`,
      {
        expenditureId,
        amount: expenditureData.amount,
        monthOfTheYear,
        year: expenditureData.year,
        categoriesId: expenditureData.categoriesId,
        ...(expenditureData.goalsId !== null && {
          goalsId: expenditureData.goalsId,
        }),
      },
      {
        headers: {
          userId: userId,
        },
      }
    );
    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to delete an expenditure for a specific user
export const deleteExpenditure = async (
  userId: string,
  expendituresId: number
) => {
  try {
    const response = await axios.delete("/auth/v1/expenditure/delete", {
      data: {
        expendituresId,
      },
      headers: {
        userId: userId,
      },
    });
    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};
