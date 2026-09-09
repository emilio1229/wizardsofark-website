import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { GlassPanel } from './GlassPanel';

type Props = {
  children: ReactNode;
  fallbackTitle?: string;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('UI error boundary caught:', error, info);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4 }}>
          <GlassPanel>
            <Typography variant="h5" gutterBottom>
              {this.props.fallbackTitle || 'Something went wrong'}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              This section failed to render. You can reload the page or continue browsing other areas of the realm.
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Reload
            </Button>
          </GlassPanel>
        </Box>
      );
    }

    return this.props.children;
  }
}
