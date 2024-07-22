import axios from "axios";

export const getGoals = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }
    const response = await axios.get("/auth/v1/goal/all", {
      headers: {
        userId: userId,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addGoal = async (
  userId: string,
  title: string,
  amount: number
) => {
  try {
    const response = await axios.post(
      "/auth/v1/goal/add",
      {
        title,
        amount,
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
