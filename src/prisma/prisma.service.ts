import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://hadi:hadi986532147@localhost:5432/DDB?schema=public',
        },
      },
    });
  }
}
