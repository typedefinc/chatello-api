import { FastifyReply, FastifyRequest } from "fastify";
import { AuthLoginDto, RefreshTokenDto } from "../../models/auth.model";
import { createUser, getUserByEmail, getUserById, updateUserByEmail } from "../user/user.service";
import { app } from "../../index";
import { Prisma } from "@prisma/client";
import { UserModel } from "../../models/user.model";

const loginHandler = async (request: FastifyRequest<{ Body: AuthLoginDto }>, reply: FastifyReply) => {
  const { email, password } = request.body;

  const user = await getUserByEmail(email);

  if (!user || user.password !== password) {
    return reply.code(401).send({
      message: 'Invalid Email or Password'
    });
  }

  const accessToken = await reply.jwtSign({
    id: user.id,
    name: user.name,
    email: user.email,
  }, { expiresIn: '5m' });

  const refreshToken = app.jwt.sign({
    id: user.id,
  }, { expiresIn: '30d' });

  await updateUserByEmail(user.email, {
    refreshToken,
  });

  return reply.code(200).send({ accessToken, refreshToken });
};

const refreshHandler = async (request: FastifyRequest<{ Body: RefreshTokenDto }>, reply: FastifyReply) => {
  const { refreshToken } = request.body;

  try {
    if (refreshToken && app.jwt.verify(refreshToken)) {
      const { id } = app.jwt.decode(refreshToken) as { id: number };

      const user = await getUserById(id);

      if (!user) {
        return reply.code(401).send({
          message: 'Invalid refresh token'
        });
      }

      const newAccessToken = await reply.jwtSign({
        id: user.id,
        name: user.name,
        email: user.email,
      }, { expiresIn: '5m' });

      const newRefreshToken = app.jwt.sign({
        id: user.id,
      }, { expiresIn: '30d' });

      await updateUserByEmail(user.email, {
        refreshToken: newRefreshToken,
      });

      return reply.code(200).send({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    }
  } catch (error: unknown) {
    console.error(error);
   return reply.code(403);
  }
};

const signupHandler = async (request: FastifyRequest<{ Body: Prisma.UserCreateInput }>, reply: FastifyReply) => {
  const { email, name, password } = request.body;

  const userIsExist = await getUserByEmail(email);

  if (userIsExist) {
    return reply.code(451).send({
      message: 'Email already exist',
    });
  }

  await createUser({
    email,
    name,
    password,
  });

  return reply.code(200).send({});
};

const userDataHandler = async (request: FastifyRequest, reply: FastifyReply) => {
  const user: UserModel = request.user as UserModel;

  try {
    const userData = await getUserById(user.id);

    if (userData) {
      return reply.code(200).send({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      });
    }

    return reply.code(404).send({
      message: 'User not found'
    });
  } catch (error: unknown) {
    console.error(error);
  }
};

export {
  loginHandler,
  refreshHandler,
  signupHandler,
  userDataHandler,
};
