import { Body, Controller, Post } from '@nestjs/common';
import { TiktokService } from '../services/tiktok.service';
import { CreateTiktokDto } from '../dto/create-tiktok.dto';

@Controller('tiktok')
export class TiktokController {
  constructor(private readonly tiktokService: TiktokService) {}

  @Post('publish')
  publish(@Body() createTiktokDto: CreateTiktokDto) {}
}
