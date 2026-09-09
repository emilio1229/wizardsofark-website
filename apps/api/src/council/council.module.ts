import { Module } from '@nestjs/common';
import { CouncilController } from './council.controller';
import { CouncilService } from './council.service';

@Module({
  controllers: [CouncilController],
  providers: [CouncilService],
  exports: [CouncilService],
})
export class CouncilModule {}
