import { Controller, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create')
  async createUser(@Request() req) {
    return await this.userService.createUser(
      req.body.user_id,
      req.body.user_password,
    );
  }
}
