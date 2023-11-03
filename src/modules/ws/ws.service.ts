import { app } from "../../index";
import prisma from "../../db";

const createMessage = (chatId: number, userId: number, text: string) => {
  return prisma.message.create({
    data: {
      chatId,
      userId,
      text,
    },
  });
};

const sendMessageToAllUsersWithoutMe = (message: string) => {
  app.websocketServer.clients.forEach((client) => {
    client.send(message.toString());
  });
};

const sendMessageToAllUsers = (message: string) => {
  app.websocketServer.clients.forEach((client) => {
    client.send(message.toString());
  });
};

export {
  sendMessageToAllUsers,
  sendMessageToAllUsersWithoutMe,
  createMessage,
};
