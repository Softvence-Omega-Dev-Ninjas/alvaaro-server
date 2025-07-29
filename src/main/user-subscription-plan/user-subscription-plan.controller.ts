import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserSubscriptionPlanService } from './user-subscription-plan.service';
import { CreateUserSubscriptionPlanDto } from './dto/create-user-subscription-plan.dto';
import { UpdateUserSubscriptionPlanDto } from './dto/update-user-subscription-plan.dto';

@Controller('user-subscription-plan')
export class UserSubscriptionPlanController {
  constructor(private readonly userSubscriptionPlanService: UserSubscriptionPlanService) {}

  @Post()
  create(@Body() createUserSubscriptionPlanDto: CreateUserSubscriptionPlanDto) {
    return this.userSubscriptionPlanService.create(createUserSubscriptionPlanDto);
  }

  @Get()
  findAll() {
    return this.userSubscriptionPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userSubscriptionPlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserSubscriptionPlanDto: UpdateUserSubscriptionPlanDto) {
    return this.userSubscriptionPlanService.update(+id, updateUserSubscriptionPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userSubscriptionPlanService.remove(+id);
  }
}
