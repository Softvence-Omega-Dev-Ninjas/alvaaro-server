import { Test, TestingModule } from '@nestjs/testing';
import { UserSubscriptionPlanController } from './user-subscription-plan.controller';
import { UserSubscriptionPlanService } from './user-subscription-plan.service';

describe('UserSubscriptionPlanController', () => {
  let controller: UserSubscriptionPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSubscriptionPlanController],
      providers: [UserSubscriptionPlanService],
    }).compile();

    controller = module.get<UserSubscriptionPlanController>(UserSubscriptionPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
