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
