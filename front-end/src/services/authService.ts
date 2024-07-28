import { UserType } from "@/types/UserType"; // Importing UserType type
import axios from "@/utils/axios"; // Importing axios instance

// Interface for sign-up properties
interface SignUpProps {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

// Interface for login properties
interface LoginProps {
  username: string;
  password: string;
}

// Function to sign up a new user
export const signUp = async ({
  username,
  firstname,
  lastname,
  password,
  email,
}: SignUpProps) => {
  try {
    const response = await axios.post("/v1/user/signup", {
      username,
      firstname,
      lastname,
      password,
      email,
    });

    return response.data; // Return the response data
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to log in a user
export const login = async (
  { username, password }: LoginProps,
  setUser: (user: UserType, token?: string) => void
) => {
  try {
    const response = await axios.post("/v1/user/signin", {
      username,
      password,
    });
    const { token, data } = response.data;

    if (!token) {
      throw new Error("No token provided"); // Throw error if no token is provided
    }

    setUser({ ...data, token }); // Set the user data with the token

    // Set default headers for axios
    axios.defaults.headers.common["userId"] = data.userId;
    axios.defaults.headers.common["Authorization"] = `${token}`;

    return true; // Return true if login is successful
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to log out a user
export const logout = async ({
  setUser,
}: {
  setUser: (user: UserType) => void;
}) => {
  try {
    setUser(null); // Clear the user data
    // Clear default headers for axios
    axios.defaults.headers.common["Authorization"] = "";
    axios.defaults.headers.common["userId"] = "";
    return true; // Return true if logout is successful
  } catch (error) {
    throw error; // Throw error if request fails
  }
};

// Function to update user data
export const updateUser = async (user: UserType) => {
  try {
    const response = await axios.put("/v1/user/update", user);
    return response.data.data; // Return the updated user data
  } catch (error) {
    throw error; // Throw error if request fails
  }
};
