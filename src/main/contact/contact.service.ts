import { Injectable } from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { PrismaService } from 'src/prisma-service/prisma-service.service';
import { ApiResponse } from 'src/utils/common/apiresponse/apiresponse';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) { }

  async create(createContactDto: CreateContactDto) {
    const contact = await this.prisma.contact.create({
      data: createContactDto,
    });
    return ApiResponse.success(contact, 'Contact created successfully');
  }

  async findAll() {
    const contacts = await this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return ApiResponse.success(contacts, 'Contacts retrieved successfully');
  }
}
