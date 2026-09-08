import { useMemo } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import type { CouncilMember } from '../../types/council';
import { getMemberAngle, polarToCartesian } from '../../utils/councilLayout';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { woaTokens } from '../../theme/tokens';
import { CouncilCrest } from './CouncilCrest';
import { CouncilOrb } from './CouncilOrb';
import { MagicConnection } from './MagicConnection';

type CouncilConstellationProps = {
  members: CouncilMember[];
  selectedId: string;
  hoveredId: string | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  compact?: boolean;
};

export function CouncilConstellation({
  members,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
  compact = false,
}: CouncilConstellationProps): JSX.Element {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const reducedMotion = usePrefersReducedMotion();

  const size = compact ? 480 : isTablet ? 820 : 960;
  const center = size / 2;
  const ringRadius = compact ? 175 : isTablet ? 300 : 355;
  const orbSize = compact ? 120 : isTablet ? 156 : 184;
  const crestSize = compact ? 130 : isTablet ? 180 : 200;

  const selectedMember = members.find((m) => m.id === selectedId);
  const hoveredMember = members.find((m) => m.id === hoveredId);
  const energyColor = selectedMember?.energyColor || woaTokens.colours.primary.main;

  const positions = useMemo(
    () =>
      members.map((member, index) => {
        const angle = getMemberAngle(member, index, members.length);
        const point = polarToCartesian(center, center, ringRadius, angle);
        return { member, angle, ...point };
      }),
    [members, center, ringRadius],
  );

  const selectedPos = positions.find((p) => p.member.id === selectedId);
  const hoveredPos = hoveredId && hoveredId !== selectedId
    ? positions.find((p) => p.member.id === hoveredId)
    : undefined;

  const crestCenter = { x: center, y: center };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: size,
        mx: 'auto',
        aspectRatio: '1 / 1',
      }}
    >
      {/* Soft radial stage */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: '4%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(energyColor, 0.1)} 0%, ${alpha(woaTokens.colours.primary.main, 0.06)} 40%, transparent 70%)`,
          border: `1px solid ${alpha(woaTokens.colours.primary.main, 0.18)}`,
          boxShadow: `inset 0 0 80px ${alpha(woaTokens.colours.primary.main, 0.08)}`,
          transition: `background ${woaTokens.motion.slow}ms ease`,
        }}
      />

      {/* Decorative staff (low opacity, non-interactive) */}
      <Box
        component="img"
        src="/assets/effects/arcane-staff.png"
        alt=""
        aria-hidden
        sx={{
          position: 'absolute',
          left: '50%',
          bottom: '6%',
          transform: 'translateX(-50%)',
          width: compact ? 48 : 72,
          height: 'auto',
          opacity: 0.18,
          pointerEvents: 'none',
          filter: 'blur(0.2px)',
          zIndex: 0,
        }}
      />

      <AnimatePresence mode="wait">
        {selectedPos ? (
          <MagicConnection
            key={`conn-${selectedId}`}
            from={crestCenter}
            to={{ x: selectedPos.x, y: selectedPos.y }}
            colour={energyColor}
            reducedMotion={reducedMotion}
            viewBoxSize={size}
          />
        ) : null}
      </AnimatePresence>

      {hoveredPos && hoveredMember ? (
        <MagicConnection
          key={`preview-${hoveredId}`}
          from={crestCenter}
          to={{ x: hoveredPos.x, y: hoveredPos.y }}
          colour={hoveredMember.energyColor}
          preview
          reducedMotion={reducedMotion}
          viewBoxSize={size}
        />
      ) : null}

      <Box
        sx={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
        }}
      >
        <CouncilCrest
          energyColor={energyColor}
          pulsing={Boolean(hoveredId) || Boolean(selectedId)}
          reducedMotion={reducedMotion}
          size={crestSize}
        />
      </Box>

      {positions.map(({ member, x, y }) => (
        <Box
          key={member.id}
          sx={{
            position: 'absolute',
            left: x,
            top: y,
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
          }}
        >
          <CouncilOrb
            member={member}
            selected={selectedId === member.id}
            hovered={hoveredId === member.id}
            size={orbSize}
            onSelect={() => onSelect(member.id)}
            onHover={(active) => onHover(active ? member.id : null)}
          />
        </Box>
      ))}
    </Box>
  );
}

export default CouncilConstellation;
