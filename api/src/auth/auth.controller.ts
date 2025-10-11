import { Body, Controller, Post, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, VerifyCodeDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  @Post('verify-code')
  async verifyCode(@Body() verifyCodeDto: VerifyCodeDto) {
    return this.authService.verifyCode(verifyCodeDto);
  }
  @Post('logout')
  async logout(@Headers('authorization') header: string) {
    return this.authService.logout(header);
  }
  @Post('logout-all')
  async logoutAll(@Headers('authorization') header: string) {
    return this.authService.logoutAll(header);
  }
  @Post('refresh')
  async refresh(@Headers('authorization') header: string) {
    return this.authService.refresh(header);
  }
}
