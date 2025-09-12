import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // find current user
  @Get('me')
  @UseGuards(AuthGuard)
  async findCurrentUser(@Req() req: Request) {
    return await this.userService.findCurrentUser(req['userid'] as string);
  }
  @Get('me/plan')
  @UseGuards(AuthGuard)
  async findCurrentPlan(@Req() req: Request) {
    return await this.userService.findCurrentPlan(req['userid'] as string);
  }
}
