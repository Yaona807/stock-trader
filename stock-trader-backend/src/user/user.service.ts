import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async getUserPassword(user_id) {
    return await prisma.$transaction(
      async (prisma) =>
        await prisma.user
          .findFirst({
            select: {
              password: true,
            },
            where: {
              email: user_id,
            },
          })
          .then((user) => {
            return user ? user.password : '';
          }),
    );
  }

  async createUser(user_id, user_password) {
    return await prisma.$transaction(
      async (prisma) =>
        await prisma.user.create({
          data: {
            email: user_id,
            password: await hash(user_password, 10),
          },
        }),
    );
  }
}
