import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginDto } from './dto/login.dto.js';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service.js';
import { JwtService } from '@nestjs/jwt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(data: CreateUserDto) {
    const { password, username, ...userData } = data;

    if (await this.usersService.findUserByUsername(username)) {
      throw new ConflictException('Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.createUser(
      username,
      hashedPassword,
      userData,
    );
    return this.buildTokens(user, randomUUID());
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findUserByUsername(data.username);

    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }

    return this.buildTokens(user, randomUUID());
  }

  private async buildTokens(
    user: { id: string; username: string },
    familyId: string,
  ) {
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    });
    const refreshToken = this.generateRefreshToken();
    const days = Number(this.config.get('REFRESH_EXPIRES_DAYS') ?? 7);
    const expires = days * 24 * 60 * 60 * 1000;

    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hashToken(refreshToken),
        familyId,
        userId: user.id,
        expiresAt: new Date(Date.now() + expires),
      },
    });

    return { accessToken, refreshToken, expires };
  }

  async refresh(rawToken: string | undefined) {
    if (!rawToken) throw new UnauthorizedException();

    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: this.hashToken(rawToken) },
      include: { user: true },
    });

    if (!stored) throw new UnauthorizedException();

    if (stored.revokedAt) {
      await this.revokeFamily(stored.familyId);
      throw new UnauthorizedException();
    }

    if (stored.expiresAt < new Date()) throw new UnauthorizedException();

    const { count } = await this.prisma.refreshToken.updateMany({
      where: { id: stored.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    if (count === 0) {
      await this.revokeFamily(stored.familyId);
      throw new UnauthorizedException();
    }

    return this.buildTokens(stored.user, stored.familyId);
  }

  async logout(rawToken: string | undefined) {
    if (!rawToken) return;

    const stored = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: this.hashToken(rawToken) },
    });

    if (!stored) return;

    await this.revokeFamily(stored.familyId);
  }

  // # HELPERS ------------------
  generateRefreshToken() {
    return randomBytes(48).toString('base64url');
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  revokeFamily(familyId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { familyId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
