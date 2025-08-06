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
      'act.vijtqLqn7Jlgy4C13y1A3uVvQpOHVbrGE0LnpZaUrFtrBpicDTydbqEyMcj5!4450.va',
  })
  accessToken: string;
}
