import axios from "@/utils/axios";

interface SignUpProps {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
}

interface LoginProps {
  username: string;
  password: string;
}

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

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (
  { username, password }: LoginProps,
  setUser: (user: any) => void
) => {
  try {
    const response = await axios.post("/v1/user/signin", {
      username,
      password,
    });
    const { token, data } = response.data;

    if (!token) {
      throw new Error("No token provided");
    }

    setUser(data);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    return true;
  } catch (error) {
    throw error;
  }
};

export const logout = async ({ setUser }: { setUser: (user: any) => void }) => {
  try {
    setUser(null);
    axios.defaults.headers.common["Authorization"] = "";
    return true;
  } catch (error) {
    throw error;
  }
};
