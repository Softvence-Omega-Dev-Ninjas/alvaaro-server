import { PartialType } from '@nestjs/swagger';
import { CreateUserSubscriptionPlanDto } from './create-user-subscription-plan.dto';

export class UpdateUserSubscriptionPlanDto extends PartialType(CreateUserSubscriptionPlanDto) {}
