import React, { useEffect, useRef, useState } from 'react';
import {
  UIResourceRenderer,
  UIActionResult,
  isUIResource,
} from '@mcp-ui/client';
import type { Resource } from '@modelcontextprotocol/sdk/types';
import { remoteElements } from './radix';
import { radixComponentLibrary } from './radix';

type UIResourceBlock = {
  type: 'resource';
  resource: Resource;
};

const VARIANTS = ['raw-basic', 'raw-dark', 'external', 'remote-dom-basic', 'remote-dom'] as const;
type Variant = (typeof VARIANTS)[number];

const SERVER_BASE = 'http://localhost:8081';

const App: React.FC = () => {
  const [variant, setVariant] = useState<Variant>('remote-dom');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<UIResourceBlock | null>(null);
  const [lastAction, setLastAction] = useState<any>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Fetch UI resource from your Node server
  useEffect(() => {
    setLoading(true);
    setError(null);
    const url =
      variant === 'remote-dom' ? `${SERVER_BASE}/remote-dom/` : `${SERVER_BASE}/ui/${variant}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isUIResource(json)) {
          setResource(json);
        } else {
          setError('Server did not return a UIResource');
        }
      })
      .catch((err) => {
        setError(err.message ?? 'Fetch error');
      })
      .finally(() => setLoading(false));
  }, [variant]);

  const handleUIAction = async (result: UIActionResult) => {
    switch (result.type) {
      case 'notify':
        alert(`Notification: ${result.payload.message}`);
        break;
      case 'intent':
        console.log('Intent:', result.payload.intent, result.payload.params);
        saveUIAction(result);
        break;
      case 'tool':
        console.log('Tool call:', result.payload.toolName, result.payload.params);
        saveUIAction(result);
        break;
      case 'prompt':
        break;
      case 'link':
        saveUIAction(result);
        console.log('Other action:', result);
        break;
    }

    if (result.type) {
      setLastAction(result);
    }
    return { status: 'handled' as const };
  };

  const saveUIAction = async (input: any) => {
    await apiCall('http://localhost:8081/user/action', input);
  };

async function apiCall(resourceEndpoint: string, input: any) {
  const res = await fetch(resourceEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: 'user-123',
      resourceUri: input?.uri ?? resource?.resource?.uri,
      actionType: input.type,
      toolName: (input as any).payload?.toolName,
      payload: input.payload?.params || input.payload || {},
    }),
  });
  const json = await res.json();

  // Case 1: backend returns a full UIResource
  if (isUIResource(json)) {
    setResource(json);
  }
  return json;
}


  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const shellStyle: React.CSSProperties = {
    minHeight: '100vh',
    margin: 0,
    padding: 24,
    boxSizing: 'border-box',
    background:
      'radial-gradient(circle at top, rgba(129,140,248,0.25), transparent 55%), radial-gradient(circle at bottom, rgba(236,72,153,0.16), #020617)',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    fontFamily,
  };

  const layoutStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 1280,
    display: 'grid',
    gridTemplateColumns: '320px minmax(0, 1fr)',
    gap: 24,
    color: '#0f172a',
  };

  const panelCard: React.CSSProperties = {
    background: 'rgba(15,23,42,0.95)',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 24px 60px rgba(15,23,42,0.75)',
    border: '1px solid rgba(148,163,184,0.35)',
    color: '#e5e7eb',
    boxSizing: 'border-box',
  };

  const headerTitle: React.CSSProperties = {
    fontSize: 20,
    fontWeight: 700,
    letterSpacing: '0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const badgeStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 600,
    padding: '4px 8px',
    borderRadius: 999,
    border: '1px solid rgba(129,140,248,0.7)',
    color: '#a5b4fc',
    background: 'rgba(30,64,175,0.4)',
    textTransform: 'uppercase',
  };

  const subText: React.CSSProperties = {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    lineHeight: 1.5,
  };

  const selectStyle: React.CSSProperties = {
    width: '100%',
    marginTop: 6,
    padding: '8px 10px',
    borderRadius: 10,
    border: '1px solid rgba(55,65,81,0.9)',
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.86), rgba(17,24,39,0.96))',
    color: '#ebebf1ff',
    fontSize: 13,
    outline: 'none',
    boxShadow: '0 1px 2px rgba(15,23,42,0.6)',
  };

  const optionStyle: React.CSSProperties = {
    color: '#101010ff',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ca3af',
    marginTop: 16,
    display: 'block',
  };

  const jsonCard: React.CSSProperties = {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(3,7,18,1))',
    border: '1px solid rgba(31,41,55,1)',
    boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.7)',
    fontSize: 11,
    maxHeight: 220,
    overflow: 'auto',
    color: '#e5e7eb',
  };

  const mainCard: React.CSSProperties = {
    ...panelCard,
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92))',
    border: '1px solid rgba(148,163,184,0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  };

  const mainHeader: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  };

  const mainTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    color: '#e5e7eb',
  };

  const mainSubtitle: React.CSSProperties = {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  };

  const pill: React.CSSProperties = {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    background: 'rgba(15,23,42,0.9)',
    border: '1px solid rgba(75,85,99,0.8)',
    color: '#9ca3af',
  };

  const rendererShell: React.CSSProperties = {
    marginTop: 4,
    borderRadius: 16,
    padding: 12,
    background: 'radial-gradient(circle at top, #0f172a, #020617)',
    border: '1px solid rgba(31,41,55,1)',
    minHeight: 260,
    maxWidth: 500,
    boxShadow: '0 18px 45px rgba(15,23,42,0.9)'
  };

  const emptyState: React.CSSProperties = {
    height: '100%',
    borderRadius: 12,
    border: '1px dashed rgba(55,65,81,0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    color: '#6b7280',
    padding: 16,
    textAlign: 'center',
  };

  return (
    <div style={shellStyle}>
      <div style={layoutStyle}>
        {/* Left panel */}
        <div style={panelCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={headerTitle}>
              MCP-UI PoC
            </h2>
            <span style={badgeStyle}>Client 5.14.1</span>
          </div>

          <p style={subText}>
            Experiment with different UI resource variants and see how Remote DOM elements render
            through your custom React component library.
          </p>

          <label style={labelStyle}>
            Variant
            <select
              style={selectStyle}
              value={variant}
              onChange={(e) => setVariant(e.target.value as Variant)}
            >
              {VARIANTS.map((v) => (
                <option key={v} value={v} style={optionStyle}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          {loading && (
            <p style={{ marginTop: 12, fontSize: 12, color: '#e5e7eb' }}>Loading resource…</p>
          )}
          {error && (
            <p style={{ marginTop: 12, fontSize: 12, color: '#fecaca' }}>
              Error: {error}
            </p>
          )}

          {resource && (
            <>
              <span style={labelStyle}>Raw UI Resource JSON</span>
              <pre style={jsonCard}>{JSON.stringify(resource, null, 2)}</pre>
            </>
          )}

          {lastAction && (
            <>
              <span style={labelStyle}>Last UI Action</span>
              <pre
                style={{
                  ...jsonCard,
                  maxHeight: 160,
                  background:
                    'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,1))',
                }}
              >
                {JSON.stringify(lastAction, null, 2)}
              </pre>
            </>
          )}

          {!resource && !loading && !error && (
            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                color: '#9ca3af',
                padding: 10,
                borderRadius: 10,
                background: 'rgba(15,23,42,0.8)',
                border: '1px dashed rgba(55,65,81,0.9)',
              }}
            >
              Choose a variant to fetch a UI resource from your Node server and see how it renders.
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={mainCard}>
          <div style={mainHeader}>
            <div>
              <h3 style={mainTitle}>MCP UI Renderer</h3>
              <p style={mainSubtitle}>
                This panel uses <code>UIResourceRenderer</code> with your{' '}
                <code>ReactComponentLibrary</code> to render Remote DOM elements.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <span style={pill}>
                Variant: <strong style={{ color: '#e5e7eb' }}>{variant}</strong>
              </span>
              {resource && (
                <span style={{ fontSize: 11, color: '#9ca3af' }}>
                  URI:{' '}
                  <code style={{ color: '#e5e7eb' }}>
                    {resource.resource?.uri || '—'}
                  </code>
                </span>
              )}
            </div>
          </div>

          <div style={rendererShell}>
            {resource ? (
              <UIResourceRenderer
                key={
                  resource.resource?.uri ||
                  ((resource.resource as any).mimeType || '') +
                    ':' +
                    (((resource.resource as any).text || '') as string).length
                }
                resource={resource.resource}
                onUIAction={handleUIAction}
                remoteDomProps={{
                  library: radixComponentLibrary,
                  remoteElements: remoteElements,
                }}
              />
            ) : (
              <div style={emptyState}>
                No resource loaded yet. Select a variant on the left to load and render a UI
                resource.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
