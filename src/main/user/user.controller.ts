import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Request } from 'express';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
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
  // userupdate 
  @Patch('me/update')
  @UseGuards(AuthGuard)
  async updateCurrentUser(@Req() req: Request, @Body() dto: UpdateUserDto) {
    return await this.userService.updateCurrentUser(req['userid'] as string, dto);
  }
}
