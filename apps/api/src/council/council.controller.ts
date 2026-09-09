import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import type { CouncilMemberDto } from '@woa/shared';
import { CouncilService } from './council.service';

@Controller('council')
export class CouncilController {
  constructor(private readonly councilService: CouncilService) {}

  @Get()
  listCouncil(): Promise<CouncilMemberDto[]> {
    return this.councilService.findAll();
  }

  @Get(':id')
  async getMember(@Param('id') id: string): Promise<CouncilMemberDto> {
    const member = await this.councilService.findById(id);
    if (!member) {
      throw new NotFoundException('Council member not found');
    }
    return member;
  }
}
