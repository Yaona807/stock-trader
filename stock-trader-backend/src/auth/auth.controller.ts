import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Req() req, @Res({ passthrough: true }) res) {
    try {
      await this.authService.login(req, res);
    } catch (err) {
      this.authService.logout(req, res);
      throw new UnauthorizedException();
    }
  }
  @Post('/logout')
  logout(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.logout(req, res);
  }
}
