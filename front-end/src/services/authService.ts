import axios from "@/utils/axios";

interface SignUpProps {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

export const signUp = async ({
  username,
  firstname,
  lastname,
  password,
  email,
}: SignUpProps) => {
  try {
    const response = await axios.post("/user/signup", {
      username,
      firstname,
      lastname,
      password,
      email,
    });

    return response.data;
  } catch (error) {
    throw error.message;
  }
};
