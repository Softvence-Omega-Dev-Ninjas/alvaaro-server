import { Injectable } from '@nestjs/common';
import { CreateUserSubscriptionPlanDto } from './dto/create-user-subscription-plan.dto';
import { UpdateUserSubscriptionPlanDto } from './dto/update-user-subscription-plan.dto';

@Injectable()
export class UserSubscriptionPlanService {
  create(createUserSubscriptionPlanDto: CreateUserSubscriptionPlanDto) {
    return 'This action adds a new userSubscriptionPlan';
  }

  findAll() {
    return `This action returns all userSubscriptionPlan`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userSubscriptionPlan`;
  }

  update(id: number, updateUserSubscriptionPlanDto: UpdateUserSubscriptionPlanDto) {
    return `This action updates a #${id} userSubscriptionPlan`;
  }

  remove(id: number) {
    return `This action removes a #${id} userSubscriptionPlan`;
  }
}
