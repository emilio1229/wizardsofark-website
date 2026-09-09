import type { CouncilMember } from '../types/council';

/** Degrees: 0 = east/right, -90 = north/top (SVG / CSS convention). */
export function getMemberAngle(member: CouncilMember, index: number, total: number): number {
  if (typeof member.angle === 'number') {
    return member.angle;
  }
  if (total <= 0) {
    return -90;
  }
  return (360 / total) * index - 90;
}

export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
): { x: number; y: number } {
  const angleInRadians = (angleInDegrees * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/** Softly signal crest accent — keep purple identity while hinting energy. */
export function crestAccentOpacity(selected: boolean): number {
  return selected ? 0.55 : 0.35;
}

export function formatCouncilStatus(status?: string): string {
  if (!status) {
    return 'Unknown';
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}
