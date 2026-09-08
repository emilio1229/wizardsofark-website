import { Box, ButtonBase, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { CouncilMember } from '../../types/council';
import { woaTokens } from '../../theme/tokens';

type CouncilOrbProps = {
  member: CouncilMember;
  selected?: boolean;
  hovered?: boolean;
  size?: number;
  showName?: boolean;
  onSelect: () => void;
  onHover?: (hovered: boolean) => void;
  style?: React.CSSProperties;
};

export function CouncilOrb({
  member,
  selected = false,
  hovered = false,
  size = 144,
  showName = false,
  onSelect,
  onHover,
  style,
}: CouncilOrbProps): JSX.Element {
  const colour = member.energyColor;
  const active = selected || hovered;

  return (
    <ButtonBase
      focusRipple
      onClick={onSelect}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onFocus={() => onHover?.(true)}
      onBlur={() => onHover?.(false)}
      aria-label={`View ${member.title}`}
      aria-pressed={selected}
      style={style}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 0.75,
        borderRadius: `${woaTokens.radius.md}px`,
        p: size >= 120 ? 1 : 0.5,
        color: 'inherit',
        transition: `transform ${woaTokens.motion.normal}ms ease`,
        transform: selected ? 'scale(1.06)' : hovered ? 'scale(1.04)' : 'scale(1)',
        '&:focus-visible': {
          outline: `2px solid ${colour}`,
          outlineOffset: 4,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          p: '3px',
          background: `linear-gradient(145deg, ${alpha(colour, active ? 0.95 : 0.55)}, ${alpha(colour, 0.15)})`,
          boxShadow: selected
            ? `0 0 0 3px ${alpha(colour, 0.28)}, 0 0 26px ${alpha(colour, 0.55)}`
            : hovered
              ? `0 0 18px ${alpha(colour, 0.45)}`
              : `0 0 12px ${alpha(colour, 0.22)}`,
          transition: `box-shadow ${woaTokens.motion.normal}ms ease, transform ${woaTokens.motion.normal}ms ease`,
          animation: selected && !hovered ? 'woa-orb-impact 0.5s ease-out' : undefined,
          '@keyframes woa-orb-impact': {
            '0%': { transform: 'scale(0.94)' },
            '40%': { transform: 'scale(1.08)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${alpha('#050811', 0.65)}`,
            bgcolor: 'background.elevated',
          }}
        >
          <Box
            component="img"
            src={member.avatar}
            alt=""
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        {selected ? (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: size >= 140 ? 18 : 14,
              height: size >= 140 ? 18 : 14,
              borderRadius: '50%',
              bgcolor: colour,
              border: '2px solid #050811',
              boxShadow: `0 0 10px ${colour}`,
            }}
          />
        ) : null}
      </Box>

      <Box sx={{ textAlign: 'center', maxWidth: size + 48 }}>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: active ? colour : 'text.secondary',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.25,
            fontSize: size >= 140 ? '0.8rem' : size >= 100 ? '0.72rem' : '0.65rem',
            transition: `color ${woaTokens.motion.normal}ms ease`,
          }}
        >
          {member.title}
        </Typography>
        {showName ? (
          <Typography variant="caption" sx={{ color: 'text.muted', fontSize: '0.65rem' }}>
            {member.name}
          </Typography>
        ) : null}
      </Box>
    </ButtonBase>
  );
}

export default CouncilOrb;
