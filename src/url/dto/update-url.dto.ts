import { IsUrl, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiPropertyOptional({
    description: 'Nova URL original',
    example: 'https://teddy360.com.br/novo-material/',
  })
  @IsOptional()
  @IsUrl({}, { message: 'URL deve ser válida' })
  originalUrl?: string;
} 