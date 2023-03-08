import {
  ForbiddenException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { Prisma } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto: AuthDto) {
    // Generate The hashed Password
    try {
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
      // delete user.hash;
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('credentials taken');
        }
      }
      throw error;
    }
  }
  async signIn(dto: AuthDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });
      // If user does not exist
      if (!user) {
        throw new BadRequestException('Credentials does not exist');
      }
      // Check the password
      const passwordMatches = await argon.verify(user.hash, dto.password);
      // When the hash password doesn't match, throw exception
      if (!passwordMatches) {
        throw new BadRequestException('Your email or password is not correct');
      }
      // To remove password from the user object
      const deletePassword = (info: Partial<typeof user>) => {
        delete info.hash;
        return info;
      };
      const userInfo = deletePassword(user);
      return userInfo;
    } catch (error) {
      throw error;
    }
  }
}
