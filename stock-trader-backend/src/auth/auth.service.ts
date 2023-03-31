import { Injectable } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async login(req, res) {
    const saved_user_password = await this.userService.getUserPassword(
      req.body.user_id,
    );

    const is_same_password = await compare(
      req.body.user_password,
      saved_user_password,
    );

    if (is_same_password) {
      return;
    } else {
      throw new Error('password mismatch');
    }
  }

  logout(req, res): any {
    const cookie = req.cookies;
    for (const prop in cookie) {
      if (!cookie.hasOwnProperty(prop)) {
        continue;
      }
      res.cookie(prop, '', { expires: new Date(0) });
    }
    req.session.destroy();
    return;
  }
}
