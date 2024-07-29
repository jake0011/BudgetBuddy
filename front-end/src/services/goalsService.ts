import axios from "axios"; // Importing axios library

// Function to get all goals for a specific user
export const getGoals = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error("User ID is required"); // Throw error if userId is not provided
    }
    const response = await axios.get("/auth/v1/goal/all", {
      headers: {
        userId: userId,
      },
    });
    return response.data.data; // Return the goals data
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to add a new goal for a specific user
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
    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to update an existing goal for a specific user
export const updateGoal = async (
  userId: string,
  goalsId: number,
  title: string,
  amount: number
) => {
  try {
    const response = await axios.patch(
      "/auth/v1/goal/update",
      {
        goalsId,
        title,
        amount,
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

// Function to delete a goal for a specific user
export const deleteGoals = async (userId: string, goalsId: number) => {
  try {
    const response = await axios.delete("/auth/v1/goal/delete", {
      data: {
        goalsId,
      },
      headers: {
        userId,
      },
    });

    return response.data.message; // Return success message
  } catch (error) {
    throw error; // Throw error if request fails
  }
};
