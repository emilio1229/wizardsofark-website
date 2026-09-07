import type { ReactNode } from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

type HeroAction = {
  label: string;
  href: string;
  external?: boolean;
};

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction?: HeroAction;
  secondaryAction?: HeroAction;
  children?: ReactNode;
};

function PageHero({ eyebrow, title, description, primaryAction, secondaryAction, children }: PageHeroProps): JSX.Element {
  const renderAction = (action: HeroAction | undefined, variant: ButtonProps['variant']) => {
    if (!action) {
      return null;
    }

    if (action.external) {
      return (
        <Button variant={variant} color="primary" href={action.href} target="_blank" rel="noreferrer">
          {action.label}
        </Button>
      );
    }

    return (
      <Button variant={variant} color="primary" component={RouterLink} to={action.href}>
        {action.label}
      </Button>
    );
  };

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: { xs: 360, md: 420 },
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(251, 248, 240, 0.72)',
        borderTop: '1px solid rgba(23, 21, 18, 0.05)',
        borderBottom: '1px solid rgba(23, 21, 18, 0.05)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(201, 168, 106, 0.28), transparent 22%), radial-gradient(circle at bottom left, rgba(44, 33, 65, 0.09), transparent 28%)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          right: { xs: '-10%', md: '6%' },
          top: '14%',
          width: { xs: 220, md: 340 },
          height: { xs: 220, md: 340 },
          borderRadius: '40% 60% 50% 50% / 38% 44% 56% 62%',
          background: 'linear-gradient(135deg, rgba(23, 21, 18, 0.06), rgba(23, 21, 18, 0.02))',
          border: '1px solid rgba(23, 21, 18, 0.08)',
        }}
      />
      <Container maxWidth="lg" sx={{ position: 'relative', py: { xs: 8, md: 10 } }}>
        <Stack spacing={3} maxWidth={760}>
          <Typography variant="overline" sx={{ color: 'text.secondary', letterSpacing: 4.8 }}>
            {eyebrow}
          </Typography>
          <Typography variant="heroTitle">{title}</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 680, lineHeight: 1.65, fontWeight: 400 }}>
            {description}
          </Typography>
          {(primaryAction || secondaryAction) && (
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              {renderAction(primaryAction, 'contained')}
              {renderAction(secondaryAction, 'outlined')}
            </Stack>
          )}
          {children}
        </Stack>
      </Container>
    </Box>
  );
}

export default PageHero;