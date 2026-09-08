import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { woaTokens } from '../../theme/tokens';

type MapArtworkProps = {
  src?: string;
  alt: string;
  height?: number | string;
  overlay?: boolean;
  label?: string;
};

/**
 * Map artwork with a themed fallback while files are being added to
 * `public/assets/maps/`.
 */
export function MapArtwork({
  src,
  alt,
  height = 160,
  overlay = true,
  label,
}: MapArtworkProps): JSX.Element {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <Box
      sx={{
        position: 'relative',
        height,
        overflow: 'hidden',
        backgroundColor: 'background.elevated',
        backgroundImage: showImage
          ? `url(${src})`
          : `linear-gradient(135deg, ${alpha(woaTokens.colours.primary.main, 0.28)}, ${alpha(woaTokens.colours.secondary.main, 0.08)} 45%, ${woaTokens.colours.background.elevated})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          sx={{
            position: 'absolute',
            width: 0,
            height: 0,
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
      ) : (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            px: 2,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.muted',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            {label || 'Map artwork pending'}
          </Typography>
        </Box>
      )}

      {overlay ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, transparent 30%, rgba(5,8,17,0.92) 100%)',
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </Box>
  );
}

export default MapArtwork;
