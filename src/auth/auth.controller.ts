import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthGuard } from './auth.guard';
import { User } from 'src/schemas/auth.schema';
import { ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userAuthService: AuthService) {}

  @Post('register')
  async registerUser(@Body() createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    if(createAuthDto.password !== createAuthDto.confirmPassword) {
      throw new HttpException('Passwords do not match', 400);
    }
    await this.userAuthService.registerUser(createAuthDto.username, createAuthDto.password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async loginUser(@Body() loginDto: LoginDto): Promise<{ message: string; token: string }> {
    const username = loginDto.username;
    const password = loginDto.password;
    const token = await this.userAuthService.loginUser(username, password);
    return { message: 'Login successful', token };
  }

  @Get('users')
  // @UseGuards(AuthGuard)
  async getUsers(): Promise<User[]> {
    return this.userAuthService.getUsers();
  }
}
