import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscriptionplan.dto';
import { SubscriptionplanService } from './subscriptionplan.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/guards/roles.decorator';
import { UserRole } from 'src/utils/common/enum/userEnum';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('subscriptionplan')
@UseGuards(AuthGuard, RolesGuard)
export class SubscriptionplanController {
  constructor(
    private readonly subscriptionplanService: SubscriptionplanService,
  ) {}

  @Post('create-plan')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateSubscriptionPlanDto) {
    return await this.subscriptionplanService.createSubscription(dto);
  }

  @Get('all-plan')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SELLER, UserRole.USER)
  async findAll() {
    const result = await this.subscriptionplanService.findAll();
    return result;
  }
  @Post('delete-plan/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deletePlan(@Param('id') id: string) {
    const result = await this.subscriptionplanService.deletePlan(id);
    return result;
  }
}
