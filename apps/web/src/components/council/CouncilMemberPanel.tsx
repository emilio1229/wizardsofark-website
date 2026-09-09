import { Avatar, Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AnimatePresence, motion } from 'framer-motion';
import type { CouncilMember } from '../../types/council';
import { FantasyDivider, GlassPanel, StatusDot } from '../common/GlassPanel';
import { formatCouncilStatus } from '../../utils/councilLayout';
import { woaTokens } from '../../theme/tokens';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type CouncilMemberPanelProps = {
  member: CouncilMember;
};

export function CouncilMemberPanel({ member }: CouncilMemberPanelProps): JSX.Element {
  const reducedMotion = usePrefersReducedMotion();
  const colour = member.energyColor;
  const statusColour =
    member.status === 'online'
      ? woaTokens.colours.status.online
      : member.status === 'offline'
        ? woaTokens.colours.status.offline
        : woaTokens.colours.status.warning;

  return (
    <GlassPanel
      sx={{
        height: '100%',
        borderColor: alpha(colour, 0.45),
        boxShadow: `0 0 28px ${alpha(colour, 0.16)}`,
        transition: `border-color ${woaTokens.motion.slow}ms ease, box-shadow ${woaTokens.motion.slow}ms ease`,
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={member.id}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.35 }}
        >
          <Stack spacing={2.25}>
            <Box
              sx={{
                height: 3,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${colour}, transparent)`,
                boxShadow: `0 0 12px ${alpha(colour, 0.55)}`,
              }}
            />

            <Typography variant="overline" sx={{ color: 'text.muted', letterSpacing: '0.18em' }}>
              Council Member
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={member.portrait}
                alt={member.name}
                sx={{
                  width: 96,
                  height: 96,
                  border: `3px solid ${colour}`,
                  boxShadow: `0 0 22px ${alpha(colour, 0.45)}`,
                }}
              />
              <Box>
                <Typography variant="overline" sx={{ color: colour, letterSpacing: '0.12em' }}>
                  {member.title}
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.25 }}>
                  {member.name}
                </Typography>
              </Box>
            </Stack>

            <Typography
              sx={{
                fontFamily: '"Cinzel", Georgia, serif',
                color: 'gold.light',
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              {member.tagline}
            </Typography>

            <FantasyDivider colour={colour} />

            <Typography color="text.secondary">{member.bio}</Typography>

            {member.quote ? (
              <Typography sx={{ color: alpha(colour, 0.95), fontFamily: '"Cinzel", Georgia, serif' }}>
                “{member.quote}”
              </Typography>
            ) : null}

            <Box>
              <Typography variant="caption" sx={{ color: colour, letterSpacing: '0.14em' }}>
                Role
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5, fontWeight: 600 }}>
                {member.role}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ color: colour, letterSpacing: '0.14em' }}>
                Responsibilities
              </Typography>
              <Stack component="ul" spacing={0.5} sx={{ m: 0, mt: 0.75, pl: 2.25 }}>
                {member.responsibilities.map((item) => (
                  <Typography component="li" key={item} variant="body2" color="text.secondary">
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Box>

            {member.status ? (
              <Box>
                <Typography variant="caption" sx={{ color: colour, letterSpacing: '0.14em', display: 'block', mb: 0.75 }}>
                  Status
                </Typography>
                <StatusDot colour={statusColour} label={formatCouncilStatus(member.status)} pulse={member.status === 'online'} />
              </Box>
            ) : null}
          </Stack>
        </motion.div>
      </AnimatePresence>
    </GlassPanel>
  );
}

export default CouncilMemberPanel;
