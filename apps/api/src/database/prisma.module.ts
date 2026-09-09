import { Global, Module } from '@nestjs/common';
import { CatalogueSeedService } from './catalogue-seed.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, CatalogueSeedService],
  exports: [PrismaService],
})
export class PrismaModule {}
