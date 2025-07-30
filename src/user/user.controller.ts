import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiProperty,
  ApiBody,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SelfOrAdmin } from '../auth/decorators/self-or-admin.decorator';
import { SelfOrAdminGuard } from '../auth/guards/self-or-admin.guard';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('User')
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user (Public)' })
  @ApiBody({ type: CreateUserDto })
  register(@Body() createUserDto: CreateUserDto) {
    const userData = { ...createUserDto, user_type: 'user' };
    return this.userService.create(userData, undefined);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (Admin only)' })
  @ApiBearerAuth()
  @ApiBody({ type: CreateUserDto })
  create(@Body() createUserDto: CreateUserDto, @User() currentUser?: any) {
    return this.userService.create(createUserDto, currentUser);
  }

  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiBearerAuth()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID (Authenticated)' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user (Authenticated)' })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() currentUser?: any) {
    return this.userService.update(+id, updateUserDto, currentUser);
  }

  @SelfOrAdmin()
  @UseGuards(SelfOrAdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user (Self or Admin only)' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.delete(+id);
  }
}
