import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
}
