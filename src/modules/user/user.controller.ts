import { FastifyRequest } from "fastify";
import { getUserList } from "./user.service";
import { UserModel } from "../../models/user.model";

const getUserListHandler = async (request: FastifyRequest<{
  Querystring: { query: string},
}>) => {
  const user: UserModel = request.user as UserModel;

  const userList = await getUserList(request.query.query);
  return userList.filter((item) => item.id !== user.id);
};

export {
  getUserListHandler,
};
