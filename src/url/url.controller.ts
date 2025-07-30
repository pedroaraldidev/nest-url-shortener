import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { UrlOwnershipGuard } from './guards/url-ownership.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlResponseDto } from './dto/url-response.dto';
import { CreateUrlUseCase } from './use-cases/create-url.usecase';
import { RedirectUrlUseCase } from './use-cases/redirect-url.usecase';
import { FindUserUrlsUseCase } from './use-cases/find-user-urls.usecase';
import { UpdateUrlUseCase } from './use-cases/update-url.usecase';
import { DeleteUrlUseCase } from './use-cases/delete-url.usecase';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(
    private readonly createUrlUseCase: CreateUrlUseCase,
    private readonly redirectUrlUseCase: RedirectUrlUseCase,
    private readonly findUserUrlsUseCase: FindUserUrlsUseCase,
    private readonly updateUrlUseCase: UpdateUrlUseCase,
    private readonly deleteUrlUseCase: DeleteUrlUseCase,
  ) {}

  @Post('url/shorten')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Create a shortened URL' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'URL shortened successfully', type: UrlResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Token inválido (opcional)' })
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @CurrentUser() user?: any,
  ): Promise<UrlResponseDto> {
    const userId = user?.id ? Number(user.id) : undefined;
    return this.createUrlUseCase.execute(createUrlDto, userId);
  }

  @Get('url/my-urls')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user URLs' })
  @ApiResponse({ status: 200, description: 'User URLs retrieved successfully', type: [UrlResponseDto] })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  async getUserUrls(@CurrentUser() user: any): Promise<UrlResponseDto[]> {
    const userId = Number(user.id);
    return this.findUserUrlsUseCase.execute(userId);
  }

  @Put('url/:id')
  @UseGuards(JwtAuthGuard, UrlOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a URL' })
  @ApiBody({ type: UpdateUrlDto })
  @ApiResponse({ status: 200, description: 'URL updated successfully', type: UrlResponseDto })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async updateUrl(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUrlDto: UpdateUrlDto,
    @CurrentUser() user: any,
  ): Promise<UrlResponseDto> {
    const userId = Number(user.id);
    return this.updateUrlUseCase.execute(id, updateUrlDto, userId);
  }

  @Delete('url/:id')
  @UseGuards(JwtAuthGuard, UrlOwnershipGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a URL' })
  @ApiResponse({ status: 200, description: 'URL deleted successfully' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async deleteUrl(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: any,
  ): Promise<void> {
    const userId = Number(user.id);
    return this.deleteUrlUseCase.execute(id, userId);
  }

  @Get('test/ip')
  @ApiOperation({ summary: 'Test IP detection' })
  @ApiResponse({ status: 200, description: 'IP detection test' })
  async testIpDetection(@Req() req: Request): Promise<{ ip: string; headers: any }> {
    const clientIp = (req as any).clientIp;
    const originalIp = req.ip;
    const remoteAddress = req.connection.remoteAddress;
    
    return {
      ip: clientIp,
      headers: {
        'x-forwarded-for': req.headers['x-forwarded-for'],
        'x-real-ip': req.headers['x-real-ip'],
        'x-client-ip': req.headers['x-client-ip'],
        originalIp,
        remoteAddress,
      },
    };
  }

  @Get(':shortCode')
  @ApiOperation({ summary: 'Redirect to original URL' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @ApiResponse({ status: 404, description: 'URL não encontrada' })
  async redirectToOriginal(
    @Param('shortCode') shortCode: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    let ipAddress = (req as any).clientIp;
    
    if (!ipAddress || ipAddress === '::' || ipAddress === '::1') {
      ipAddress = '127.0.0.1';
    }

    const userAgent = req.get('User-Agent');
    const referer = req.get('Referer');

    const originalUrl = await this.redirectUrlUseCase.execute(
      shortCode,
      ipAddress,
      userAgent,
      referer,
    );

    res.redirect(HttpStatus.FOUND, originalUrl);
  }
} 