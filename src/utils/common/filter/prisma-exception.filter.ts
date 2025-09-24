import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaValidationFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Prisma error message contains the field info, we can extract it
    const errorMessage = exception.message;
    let field: string | null = null;

    // Try to find the field name from the error text
    const match = errorMessage.match(/Invalid value for argument `(\w+)`/);
    if (match) {
      field = match[1];
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: field
        ? `Invalid value provided for field: ${field}`
        : 'Validation error while creating product',
      error: {
        field,
        prismaMessage: errorMessage,
      },
    });
  }
}
