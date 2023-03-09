import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login(req, res): any {
    if (req.body.user_id === 'a') {
      return;
    } else {
      // sessionを削除するためにlogoutを呼び出す
      this.logout(req, res);
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
