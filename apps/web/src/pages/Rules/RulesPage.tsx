import { useEffect, useState } from 'react';
import { Alert, Box, Container, Grid, Typography } from '@mui/material';
import { SectionHeader, GlassPanel } from '../../components/common/GlassPanel';
import { RulesNavigation, RulesPanel } from '../../components/rules/RulesPanel';
import { useRules } from '../../hooks/useApi';
import { woaTokens } from '../../theme/tokens';

function RulesPage(): JSX.Element {
  const { data, isError, isLoading } = useRules();
  const categories = data?.status === 'success' ? data.data : [];
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    if (!selectedId && categories.length > 0) {
      setSelectedId(categories[0].id);
    }
  }, [categories, selectedId]);

  const selected = categories.find((category) => category.id === selectedId) || categories[0];

  return (
    <Container
      maxWidth={false}
      sx={{ maxWidth: woaTokens.layout.contentMaxWidth, px: { xs: 2, md: 4 }, py: { xs: 5, md: 7 } }}
    >
      <SectionHeader
        title="OUR RULES"
        subtitle="Clear expectations keep the realm fair, stable, and welcoming for every survivor."
      />

      {isError || data?.status === 'error' ? (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Rules content is temporarily unavailable.
        </Alert>
      ) : null}

      {!isLoading && selected ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ position: { md: 'sticky' }, top: { md: 96 } }}>
              <RulesNavigation categories={categories} selectedId={selected.id} onSelect={setSelectedId} />
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <RulesPanel category={selected} />
            <GlassPanel sx={{ mt: 3, textAlign: 'center' }}>
              <Typography sx={{ color: 'primary.light', fontFamily: '"Cinzel", Georgia, serif' }}>
                Together we build a stronger community.
              </Typography>
            </GlassPanel>
          </Grid>
        </Grid>
      ) : null}
    </Container>
  );
}

export default RulesPage;
