import { Injectable } from '@nestjs/common';
import { CreateNewsletterDto } from './dto/create-newsletter.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { MailService } from 'src/utils/mail/mail.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class NewsletterService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(createNewsletterDto: CreateNewsletterDto) {
    await this.prisma.newsletter.upsert({
      where: { email: createNewsletterDto.email },
      update: {},
      create: createNewsletterDto,
    });

    // Send email confirmation
    await this.mailService.sendMail(
      createNewsletterDto.email,
      'Thanks for subscribing to our newsletter!',
      'Thanks for subscribing to our newsletter!',
    );

    return ApiResponse.success(null, 'Newsletter created successfully');
  }

  async findAll() {
    return ApiResponse.success(
      await this.prisma.newsletter.findMany(),
      'Newsletters retrieved successfully',
    );
  }
}
