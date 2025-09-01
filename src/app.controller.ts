import { Controller, Get } from '@nestjs/common';
import { Public } from './guards/public.decorator';

@Controller()
export class AppController {
  @Get()
  @Public()
  getMainPage() {
    return {
      message: 'Welcome to My Alvaro Api Server 🚀',
      status: 'OK',
      version: '1.0.0',
      docs: '/api',
    };
  }
}
