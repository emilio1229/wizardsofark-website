import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { woaTokens } from '../../theme/tokens';

type GlowButtonProps = ButtonProps & {
  glow?: boolean;
};

export function GlowButton({ glow = true, sx, ...props }: GlowButtonProps): JSX.Element {
  return (
    <Button
      {...props}
      sx={{
        ...(glow && props.variant === 'contained'
          ? {
              boxShadow: woaTokens.glow.softPurple,
              '&:hover': {
                boxShadow: woaTokens.glow.strongPurple,
              },
            }
          : null),
        ...sx,
      }}
    />
  );
}
