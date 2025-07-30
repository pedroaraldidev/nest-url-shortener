import { IsUrl, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUrlDto {
  @ApiProperty({
    description: 'URL original a ser encurtada',
    example: 'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
  })
  @IsUrl({}, { message: 'URL deve ser válida' })
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Código personalizado para a URL (opcional)',
    example: 'abc123',
    maxLength: 6,
  })
  @IsOptional()
  @IsString()
  customCode?: string;
} 