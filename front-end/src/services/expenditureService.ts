import axios from "@/utils/axios";

export const getExpenditureCategories = async () => {
  try {
    const response = await axios.get("/v1/expenditure/categories");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const getUserExpenses = async (userId: string) => {
  try {
    const response = await axios.get("/auth/v1/expenditure/expenses/all", {
      headers: {
        userId: userId,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getUserBudget = async (userId: string) => {
  try {
    const response = await axios.get("/auth/v1/expenditure/budget/all", {
      headers: {
        userId: userId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
