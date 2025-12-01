// upload-multiple.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UploadMultipleDto {
    @ApiProperty({
        type: 'array',
        items: { type: 'string', format: 'binary' },
        description: 'Multiple files upload',
    })
    files: Express.Multer.File[];
}
