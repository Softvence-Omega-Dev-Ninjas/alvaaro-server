import { ApiProperty } from '@nestjs/swagger';

export class UploadTiktokVideoDto {
  @ApiProperty({
    type: 'string',
    description: 'Title of the TikTok video',
    example: 'My Awesome TikTok Video',
  })
  title: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'MP4 video file to upload',
  })
  video: any;

  @ApiProperty({
    type: 'string',
    description: 'TikTok Access Token',
    example:
      'act.TPtIxFLPcyndHohIjPtxlRnLiGSZuAKNeJA0tWTzUC1uiF7nhbnjI9HoWd0F!4480.va',
  })
  accessToken: string;

  @ApiProperty({
    type: 'string',
    description: 'Scheduled time to publish the video',
    example: '2023-03-15T12:00:00Z',
  })
  scheduledAt: Date;
}
