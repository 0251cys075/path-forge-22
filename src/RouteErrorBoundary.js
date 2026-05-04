import React from 'react';

export class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const theme = { pageBg:'#1D2226', textPrimary:'#E7E9EA', textMuted:'#B0B7BF', accent:'#0A66C2' };

    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          background: theme.pageBg,
          color: theme.textPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ maxWidth: 420, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h1 style={{ fontSize: 22, marginBottom: 12 }}>Something went wrong</h1>
            <p style={{ color: theme.textMuted, lineHeight: 1.5, marginBottom: 24 }}>
              This screen hit an error. Try going back to the dashboard or refresh the page.
            </p>
            <button
              type="button"
              onClick={() => {
                window.history.replaceState({ page: 'dashboard' }, '', window.location.pathname);
                window.location.reload();
              }}
              style={{
                background: theme.accent,
                color: '#FFFFFF',
                border: 'none',
                padding: '14px 28px',
                borderRadius: 24,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Reload to dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
