import { ApiProperty } from '@nestjs/swagger';

export class UrlResponseDto {
  @ApiProperty({ description: 'URL ID' })
  id: number;

  @ApiProperty({ description: 'Original URL' })
  originalUrl: string;

  @ApiProperty({ description: 'Short code' })
  shortCode: string;

  @ApiProperty({ description: 'Complete short URL' })
  shortUrl: string;

  @ApiProperty({ description: 'Total number of clicks' })
  clickCount: number;

  @ApiProperty({ description: 'Number of unique clicks (by IP)' })
  uniqueClickCount: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
} 