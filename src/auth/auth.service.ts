import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: AuthDto) {
    // Generate The hashed Password
    const hash = await argon.hash(dto.password);
    // Save the use in the DB
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
    return user;
  }
  signIn() {
    return { msg: 'Hey, You are signed in' };
  }
}
