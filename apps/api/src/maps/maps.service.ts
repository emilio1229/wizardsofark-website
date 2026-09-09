import { Injectable } from '@nestjs/common';
import type { ArkMapDto } from '@woa/shared';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class MapsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<ArkMapDto[]> {
    const rows = await this.prisma.arkMap.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      displayName: row.displayName,
      imagePath: row.imagePath,
      sortOrder: row.sortOrder,
    }));
  }

  async findById(id: string): Promise<ArkMapDto | null> {
    const row = await this.prisma.arkMap.findUnique({ where: { id } });
    if (!row) {
      return null;
    }
    return {
      id: row.id,
      name: row.name,
      displayName: row.displayName,
      imagePath: row.imagePath,
      sortOrder: row.sortOrder,
    };
  }
}
