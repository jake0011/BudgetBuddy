// Define a TypeScript type for user data
export type UserType = {
  userId: string; // Unique identifier for the user
  username: string; // Username of the user
  firstname: string; // First name of the user
  middlename?: string; // Middle name of the user (optional)
  lastname: string; // Last name of the user
  email: string; // Email address of the user
  token: string; // Authentication token for the user
};
