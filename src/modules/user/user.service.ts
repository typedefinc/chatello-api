import prisma from "../../db";
import { Prisma } from '@prisma/client';

const getUserList = async(query: string) => {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ]
    }
  });
};

const getUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    }
  });
};

const getUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    }
  });
};

const updateUserByEmail = async (email: string, data: Prisma.UserUpdateInput) => {
  return prisma.user.update({
    where: {
      email: email,
    },
    data,
  });
};

const createUser = async (data: Prisma.UserCreateInput) => {
  return prisma.user.create({
    data,
  });
};

export {
  getUserById,
  getUserByEmail,
  updateUserByEmail,
  createUser,
  getUserList,
};
