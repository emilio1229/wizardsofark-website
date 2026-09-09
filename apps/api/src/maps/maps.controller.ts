import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import type { ArkMapDto } from '@woa/shared';
import { MapsService } from './maps.service';

@Controller('maps')
export class MapsController {
  constructor(private readonly mapsService: MapsService) {}

  @Get()
  listMaps(): Promise<ArkMapDto[]> {
    return this.mapsService.findAll();
  }

  @Get(':id')
  async getMap(@Param('id') id: string): Promise<ArkMapDto> {
    const map = await this.mapsService.findById(id);
    if (!map) {
      throw new NotFoundException('Map not found');
    }
    return map;
  }
}
