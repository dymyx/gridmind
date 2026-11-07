import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../prisma/prisma.service.js'

@Injectable()
export class AdminGuard implements CanActivate {
	constructor (
		private prisma: PrismaService,
		private config: ConfigService
	) {}

	async canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    try {
			const userData = await this.prisma.user.findUnique(
				{
					where: {id: request.user.sub},
					select: {
						role: true
					}
				}
			)

			request.user.role = userData?.role

			if (this.config.getOrThrow('ADMIN_ROLE') !== userData?.role) return false
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
