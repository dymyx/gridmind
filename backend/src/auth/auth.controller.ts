import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { JwtAuthGuard } from './jwt-auth.guard.js';
import { LoginDto } from './dto/login.dto.js';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setRefreshCookie(res: Response, token: string, expires: number) {
    res.cookie('refresh_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/auth',
      maxAge: expires,
    });
  }

  @Post('register')
  async register(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, expires } =
      await this.authService.register(dto);
    this.setRefreshCookie(res, refreshToken, expires);

    return { accessToken };
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, expires } =
      await this.authService.login(dto);
    this.setRefreshCookie(res, refreshToken, expires);
    return { accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  checkAuth(@Req() request: { user: { sub: string; username: string } }) {
    const user = request.user;
    return {
      userId: user.sub,
      name: user.username,
    };
  }

  @Post('refresh')
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken, expires } =
      await this.authService.refresh(req.cookies?.['refresh_token']);

    this.setRefreshCookie(res, refreshToken, expires);
    return { accessToken };
  }

  @HttpCode(200)
  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.logout(req.cookies?.['refresh_token']);
    } finally {
      res.clearCookie('refresh_token', { path: '/auth' });
    }
  }
}
