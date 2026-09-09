import { Injectable } from '@nestjs/common';
import type { CouncilMemberDto } from '@woa/shared';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CouncilService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CouncilMemberDto[]> {
    const rows = await this.prisma.councilMember.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    return rows.map((row) => this.toDto(row));
  }

  async findById(id: string): Promise<CouncilMemberDto | null> {
    const row = await this.prisma.councilMember.findUnique({ where: { id } });
    return row ? this.toDto(row) : null;
  }

  private toDto(row: {
    id: string;
    name: string;
    title: string;
    role: string;
    tagline: string | null;
    avatar: string | null;
    portrait: string | null;
    energyColor: string | null;
    bio: string | null;
    responsibilities: unknown;
    accessLevel: string | null;
    status: string | null;
    quote: string | null;
    angle: number | null;
    sortOrder: number;
  }): CouncilMemberDto {
    const responsibilities = Array.isArray(row.responsibilities)
      ? (row.responsibilities as string[])
      : [];

    return {
      id: row.id,
      name: row.name,
      title: row.title,
      role: row.role,
      tagline: row.tagline,
      avatar: row.avatar,
      portrait: row.portrait,
      energyColor: row.energyColor,
      bio: row.bio,
      responsibilities,
      accessLevel: row.accessLevel,
      status: row.status,
      quote: row.quote,
      angle: row.angle,
      sortOrder: row.sortOrder,
    };
  }
}
