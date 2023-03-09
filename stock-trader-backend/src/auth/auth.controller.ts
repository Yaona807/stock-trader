import { Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.login(req, res);
  }
  @Post('/logout')
  logout(@Req() req, @Res({ passthrough: true }) res) {
    return this.authService.logout(req, res);
  }
}
