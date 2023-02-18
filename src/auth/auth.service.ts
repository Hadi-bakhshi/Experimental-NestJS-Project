import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}
  signIn() {
    return { msg: 'Hey, You are signed in' };
  }

  signUp() {
    return { msg: 'Hey, You are signed up' };
  }
}
