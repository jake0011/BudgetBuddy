import { getMonthName } from "@/helpers/monthConverter";
import axios from "@/utils/axios";

export const getExpenditureCategories = async () => {
  try {
    const response = await axios.get("/v1/expenditure/categories");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserExpenses = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const monthOfTheYear = getMonthName(month);
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
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserBudget = async (
  userId: string,
  month: number,
  year: number
) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const monthOfTheYear = getMonthName(month);
    const response = await axios.post(
      "/auth/v1/expenditure/month",
      { monthOfTheYear, year, type: "budget" },
      {
        headers: {
          userId: userId,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserRecentExpenses = async (userId: string) => {
  try {
    const response = await axios.get("/auth/v1/expenditure/expenses/recent", {
      headers: {
        userId: userId,
      },
    });

    const filteredExpenses = response.data.data.filter(
      (expense) => expense.goals !== null
    );
    return filteredExpenses;
  } catch (error) {
    throw error;
  }
};

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
    const monthOfTheYear = getMonthName(expenditureData.month);

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
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

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
    const monthOfTheYear = getMonthName(expenditureData.month);
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
    return response.data.message;
  } catch (error) {
    throw error;
  }
};

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
    return response.data.message;
  } catch (error) {
    throw error;
  }
};
