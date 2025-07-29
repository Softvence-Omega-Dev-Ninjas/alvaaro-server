import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateSubscriptionPlanDto } from './dto/create-subscriptionplan.dto';
import { SubscriptionplanService } from './subscriptionplan.service';

@Controller('subscriptionplan')
export class SubscriptionplanController {
  constructor(
    private readonly subscriptionplanService: SubscriptionplanService,
  ) {}

  @Post('create-plan')
  async create(@Body() dto: CreateSubscriptionPlanDto) {
    return await this.subscriptionplanService.createSubscription(dto);
  }

  @Get('all-plan')
  async findAll() {
    const result = await this.subscriptionplanService.findAll();
    return result;
  }
  @Post('delete-plan/:id')
  async deletePlan(@Param('id') id: string) {
    const result = await this.subscriptionplanService.deletePlan(id);
    return result;
  }
}
