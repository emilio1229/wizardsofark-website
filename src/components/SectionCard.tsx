import type { PropsWithChildren } from 'react';
import { Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

type SectionCardProps = PropsWithChildren<{
  sx?: SxProps<Theme>;
}>;

function SectionCard({ children, sx }: SectionCardProps): JSX.Element {
  return (
    <Paper
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: '30px',
        border: '1px solid rgba(23, 21, 18, 0.08)',
        background: 'rgba(251, 248, 240, 0.82)',
        backdropFilter: 'blur(14px)',
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
}

export default SectionCard;