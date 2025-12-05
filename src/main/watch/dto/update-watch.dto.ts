import { ApiProperty } from '@nestjs/swagger';

export class UpdateWatchDto {
  @ApiProperty({
    required: false,
    example: 'Luxury Watch',
  })
  name?: string;

  @ApiProperty({
    required: false,
    example: 'A luxury watch with diamond encrusted bezel',
  })
  description?: string;

  @ApiProperty({
    required: false,
    example: 2500,
  })
  price?: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'file',
      format: 'binary',
    },
  })
  images?: Express.Multer.File[];

  @ApiProperty({
    required: false,
    example: 'New',
  })
  condition?: string;

  @ApiProperty({
    required: false,
    example: '2020',
  })
  manufacture?: string;

  @ApiProperty({
    required: false,
    example: '2 years',
  })
  warranty?: string;

  @ApiProperty({
    required: false,
    example: 'Model X',
  })
  model?: string;

  @ApiProperty({
    required: false,
    example: '50m',
  })
  waterResistance?: string;

  @ApiProperty({
    required: false,
    example: 'Analog',
  })
  displayType?: string;

  @ApiProperty({
    required: false,
    example: 'Leather',
  })
  strapMaterial?: string;

  @ApiProperty({
    required: false,
    example: 'Automatic',
  })
  movement?: string;

  @ApiProperty({
    required: false,
    example: '40mm',
  })
  size?: string;

  @ApiProperty({
    required: false,
    example: 'Sport',
  })
  tractionType?: string;

  @ApiProperty({
    required: false,
    example: ['Water-resistant', 'Chronograph'],
  })
  features?: string[] | string;
}
