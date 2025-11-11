import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import appMetadata from './app-metadata/app-metadata';
import { Public } from './guards/public.decorator';

@Controller()
export class AppController {
  @Public()
  @ApiOkResponse({
    description: 'Returns service health status',
    example: 'hello',
  })
  @Get()
  async getHealth() {
    return {
      status: 'ok',
      version: appMetadata.version,
      name: appMetadata.displayName,
      description: appMetadata.description,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @ApiOkResponse({
    description: 'Returns service health status for monitoring',
    schema: {
      example: {
        status: 'healthy',
        timestamp: '2025-05-27T12:00:00.000Z',
        version: '0.3.1',
        uptime: 3600,
      },
    },
  })
  @Get('api/health')
  async getHealthCheck() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: appMetadata.version,
      name: appMetadata.displayName,
      description: appMetadata.description,
      uptime: process.uptime(),
    };
  }
}
