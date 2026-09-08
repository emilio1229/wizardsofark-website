import { useEffect, useRef } from 'react';
import { Box, Stack } from '@mui/material';
import type { CouncilMember } from '../../types/council';
import { CouncilOrb } from './CouncilOrb';

type CouncilMemberCarouselProps = {
  members: CouncilMember[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export function CouncilMemberCarousel({
  members,
  selectedId,
  onSelect,
}: CouncilMemberCarouselProps): JSX.Element {
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest',
    });
  }, [selectedId]);

  return (
    <Stack
      direction="row"
      spacing={1.5}
      sx={{
        overflowX: 'auto',
        px: 1,
        py: 1.5,
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {members.map((member) => {
        const selected = member.id === selectedId;
        return (
          <Box
            key={member.id}
            ref={selected ? selectedRef : undefined}
            sx={{
              scrollSnapAlign: 'center',
              flexShrink: 0,
            }}
          >
            <CouncilOrb
              member={member}
              selected={selected}
              size={128}
              showName
              onSelect={() => onSelect(member.id)}
            />
          </Box>
        );
      })}
    </Stack>
  );
}

export default CouncilMemberCarousel;
