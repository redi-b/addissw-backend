import { User as UserModel } from "../models/user";
import { User, UserInput } from "../types";

// Create a new User
export const createUser = async (data: UserInput): Promise<User> => {
  const user = await UserModel.create({
    username: data.username,
    password: data.password,
  });

  return {
    id: user._id.toHexString(),
    username: user.username,
    password: user.password,
    createdAt: user.createdAt,
  };
};

// Find a User by username
export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  const user = await UserModel.findOne({
    username,
  });

  return user
    ? {
        id: user._id.toHexString(),
        username: user.username,
        password: user.password,
        createdAt: user.createdAt,
      }
    : null;
};
