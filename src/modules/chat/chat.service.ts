import prisma from "../../db";
import { Prisma } from "@prisma/client";

const getChatList = async (userId: number) => {
  return prisma.chat.findMany({
    where: {
      users: {
        some: {
          id: userId,
        }
      }
    },
    include: {
      users: {
        select: {
          id: true,
          name: true,
        },
        where: {
          id: { not: userId }
        }
      }
    }
  });
};

const getChatByUsers = async (userIds: number[]) => {
  return prisma.chat.findFirst({
    where: {
      users: {
        every: {
          id: { in: userIds},
        }
      }
    }
  });
};

const getChatByAddress = async (address: string, userId: number) => {
  return prisma.chat.findFirst({
    where: {
      address,
    },
    include: {
      users: {
        select: {
          name: true,
          email: true,
        },
        where: {
          id: { not: userId }
        }
      }
    }
  });
};

const createChat = async (data: Prisma.ChatCreateInput) => {
  return prisma.chat.create({
    data,
  });
};

const joinUsersName = (users: { name: string }[]): string => {
  return users.reduce((acc: string[], item): string[] => {
    acc.push(item.name);

    return acc;
  }, []).join(', ');
};

const getMessagesByChat = (chatId: number) => {
  return prisma.message.findMany({
    where: {
      chatId,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 25,
  });
};

export {
  getChatList,
  createChat,
  getChatByUsers,
  getChatByAddress,
  joinUsersName,
  getMessagesByChat,
};
