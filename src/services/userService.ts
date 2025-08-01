import { UserInput } from "../types";
import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Create a new User
export const createUser = async (data: UserInput): Promise<User> => {
    const user = await prisma.user.create({
        data: {
        username: data.username,
        password: data.password, // TODO: hash the password before saving
        },
    });
    return user;
}

// Find a User by username
export const findUserByUsername = async (username: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
        where: { username },
    });
    return user;
}