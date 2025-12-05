// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from 'src/prisma-service/prisma-service.service';

// @Injectable()
// export class SubscriptionGuard implements CanActivate {
//   constructor(
//     private prisma: PrismaService,
//     private readonly jwtService: JwtService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context
//       .switchToHttp()
//       .getRequest<{ headers: Record<string, string | undefined> }>();
//     const authHeader = request.headers['authorization']?.split(' ')[1];

//     if (!authHeader) {
//       return false;
//     }
//     interface UserInfoJwt {
//       sub: string;
//       email: string;
//       role: string;
//     }
//     const payload = this.jwtService.decode<UserInfoJwt>(authHeader);

//     if (!payload) return false;
//     // Attach user info to request
//     request['userid'] = payload.sub;
//     const user = await this.prisma.user.findUnique({
//       where: { id: payload.sub },
//       select: {},
//     });

//     console.log(user);

//     // console.log(user);
//     // if (user) {
//     //   if (Number(user.accessLogs) < 5) {
//     //     await this.prisma.user.update({
//     //       where: { id: payload.sub },
//     //       data: {
//     //         accesslogs: Number(user.accesslogs) + 1,
//     //       },
//     //     });
//     //     return true;
//     //   }
//     //   if (Number(user?.accesslogs) === 5) {
//     //     throw new BadRequestException('You already posted 5 times');
//     //   }
//     // }
//     return false;
//   }
// }
