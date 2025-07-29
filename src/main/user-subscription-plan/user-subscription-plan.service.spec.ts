import { Test, TestingModule } from '@nestjs/testing';
import { UserSubscriptionPlanService } from './user-subscription-plan.service';

describe('UserSubscriptionPlanService', () => {
  let service: UserSubscriptionPlanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSubscriptionPlanService],
    }).compile();

    service = module.get<UserSubscriptionPlanService>(UserSubscriptionPlanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
