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
    const existingEmail = await this.prisma.newsletter.findUnique({
      where: { email: createNewsletterDto.email },
    });

    if (existingEmail) {
      return ApiResponse.error('This email is already subscribed.', null);
    }
    const newsLetter = await this.prisma.newsletter.create({
      data: createNewsletterDto,
    });

    // Send email confirmation
    await this.mailService.sendMail(
      createNewsletterDto.email,
      'Thanks for subscribing to our newsletter!',
      'Thanks for subscribing to our newsletter!',
    );

    return ApiResponse.success(newsLetter, 'Newsletter created successfully');
  }

  async findAll() {
    const result = await this.prisma.newsletter.findMany({
      select: {
        email: true,
        createdAt: true,
      },
    });

    return ApiResponse.success(result, 'Newsletter fetched successfully');
  }
}
