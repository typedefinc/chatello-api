import { FastifyReply, FastifyRequest } from "fastify";
import {
  createChat,
  getChatByAddress,
  getChatByUsers,
  getChatList,
  getMessagesByChat,
  joinUsersName
} from "./chat.service";
import { UserModel } from "../../models/user.model";
import { ChatCreateDto } from "../../models/chat.model";
import Crypto from "crypto";

const getChatsHandler = async (request: FastifyRequest) => {
  const user: UserModel = request.user as UserModel;

  const chatList = await getChatList(user.id);

  return chatList.map((chat) => {
    const title = joinUsersName(chat.users);

    return {
      id: chat.id,
      address: chat.address,
      title: chat.title ?? title,
    };
  });
};

const createChatHandler = async (request: FastifyRequest<{ Body: ChatCreateDto }>, reply: FastifyReply) => {
  const user: UserModel = request.user as UserModel;

  const { title, users } = request.body;

  if (users.length < 1) {
    return reply.code(400).send({
      message: 'There must be more than 1 users'
    });
  }

  if (users.length === 1) {
    const chat = await getChatByUsers([user.id, users[0]]);

    if (chat) {
      return reply.code(400).send({
        message: 'Chat already exist'
      });
    }
  }


  try {
    const address = Crypto.randomUUID();

    const chatConnectList = [
      { id: user.id },
      ...users.map((userId: number) => ({ id: userId })),
    ];

    await createChat({
      title,
      address,
      users: {
        connect: chatConnectList,
      }
    });

    return reply.code(201).send();
  } catch (error: unknown) {
    console.error(error);

    return reply.code(400).send({
      message: 'Error create chat',
    });
  }
};

const getRoomInfoHandler = async (request: FastifyRequest<{
  Params: {
    chat: string,
  }
}>, reply: FastifyReply) => {
  const user: UserModel = request.user as UserModel;
  const chat = await getChatByAddress(request.params.chat, user.id);

  if (!chat) {
    return reply.code(404).send({
      message: 'Chat not found'
    });
  }

  const title = joinUsersName(chat.users);

  return reply.code(200).send({
    ...chat,
    title,
  });
};

const getMessagesList = async (request: FastifyRequest<{
  Params: {
    chat: string,
  }
}>, reply: FastifyReply) => {
  const user: UserModel = request.user as UserModel;
  const chat = await getChatByAddress(request.params.chat, user.id);

  console.log(chat);

  if (!chat) {
    return reply.code(404).send({
      message: 'Chat not found'
    });
  }

  const messages = await getMessagesByChat(chat.id);

  return reply.code(200).send(messages.reverse());
};

export {
  getChatsHandler,
  createChatHandler,
  getRoomInfoHandler,
  getMessagesList,
};
