import React, { useEffect, useRef, useState } from 'react';
import {
  UIResourceRenderer,
  UIActionResult,
  isUIResource,
  basicComponentLibrary,
  remoteButtonDefinition,
  remoteTextDefinition,
} from '@mcp-ui/client';
import type { Resource } from '@modelcontextprotocol/sdk/types';
import {
  appComponentLibrary,
  appRemoteElements,
  remoteElements,
} from './remoteDomLibrary';
import { radixComponentLibrary } from './radix';

type UIResourceBlock = {
  type: 'resource';
  resource: Resource;
};

const VARIANTS = ['raw-basic', 'raw-dark', 'external', 'remote-dom-basic', 'remote-dom'] as const;
type Variant = (typeof VARIANTS)[number];

const SERVER_BASE = 'http://localhost:8081';

const App: React.FC = () => {
  const [variant, setVariant] = useState<Variant>('raw-basic');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resource, setResource] = useState<UIResourceBlock | null>(null);
  const [lastAction, setLastAction] = useState<any>(null);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Fetch UI resource from your Node server
  useEffect(() => {
    setLoading(true);
    setError(null);
    console.log('variant: ', variant);
    fetch(`${SERVER_BASE}/ui/${variant}`)
      .then((res) => res.json())
      .then((json) => {
        if (isUIResource(json)) {
          console.log('server response: ', json);
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
    console.log('UI action from resource:', result);

    switch (result.type) {
      case 'notify':
        alert(`Notification: ${result.payload.message}`);
        break;
      case 'intent':
        console.log('Intent:', result.payload.intent, result.payload.params);
        postCall(result);
        break;
      case 'tool':
        console.log('Tool call:', result.payload.toolName, result.payload.params);
        postCall(result);
        break;
      case 'prompt':
      case 'link':
        postCall(result);
        console.log('Other action:', result);
        break;
    }

    if(result.type) {
      setLastAction(result);
    }
    return { status: 'handled' as const };
  };

  const postCall = async (input: any) => {
    const json = await apiCall("http://localhost:8081/user/action", input);
  }

  async function apiCall(resourceEndpoint: string, input: any) {
  const res = await fetch(resourceEndpoint, { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(input)}
  );
  const json = await res.json();
  return json;
 }

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Left panel: controls + JSON + last action */}
      <div style={{ width: 320, fontSize: 14 }}>
        <h2 style={{ marginTop: 0 }}>MCP-UI Dev PoC (client 5.14.1)</h2>

        <label style={{ display: 'block', marginBottom: 8 }}>
          Variant:
          <select
            style={{ marginLeft: 8 }}
            value={variant}
            onChange={(e) => setVariant(e.target.value as Variant)}
          >
            {VARIANTS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </label>

        {loading && <p>Loading resource…</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {resource && (
          <>
            <h3 style={{ marginTop: 16 }}>Raw UIResource JSON</h3>
            <pre
              style={{
                fontSize: 11,
                maxHeight: 220,
                overflow: 'auto',
                background: '#0f172a',
                color: '#e5e7eb',
                padding: 8,
                borderRadius: 8,
              }}
            >
              {JSON.stringify(resource, null, 2)}
            </pre>
          </>
        )}

        {lastAction && (
          <>
            <h3 style={{ marginTop: 16 }}>Last UI Action</h3>
            <pre
              style={{
                fontSize: 11,
                maxHeight: 160,
                overflow: 'auto',
                background: '#111827',
                color: '#e5e7eb',
                padding: 8,
                borderRadius: 8,
              }}
            >
              {JSON.stringify(lastAction, null, 2)}
            </pre>
          </>
        )}
      </div>

      {/* Right: two panels showing different renderer configs */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
        }}
      >
        {/* Default */}
        <div>
          <h3>Default UIResourceRenderer</h3>
          <p style={{ fontSize: 12, color: '#6b7280' }}>
            Uses default settings but still passes <code>remoteDomProps</code> so
            Remote DOM works.
          </p>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 8,
              minHeight: 260,
            }}
          >
            {resource && (
              <UIResourceRenderer
                resource={resource.resource}
                onUIAction={handleUIAction}
                remoteDomProps={{
                  library: radixComponentLibrary,
                  remoteElements: remoteElements,
                }}
              />
            )}
          </div>
        </div>

        {/* Custom configuration */}
        {/* <div>
          <h3>Custom config (HTML + Remote DOM)</h3>
          <p style={{ fontSize: 12, color: '#6b7280' }}>
            Demonstrates <code>supportedContentTypes</code>, <code>htmlProps</code> and custom
            Remote DOM library.
          </p>
          <div
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              padding: 8,
              minHeight: 260,
              background: '#f9fafb',
            }}
          >
            {resource && (
              <UIResourceRenderer
                resource={resource.resource}
                onUIAction={handleUIAction}
                supportedContentTypes={['rawHtml', 'externalUrl', 'remoteDom']}
                htmlProps={{
                  style: {
                    borderRadius: 8,
                    overflow: 'hidden',
                    minHeight: 220,
                  },
                  // Added to default sandbox – API is documented for 5.14.x
                  sandboxPermissions: 'allow-popups',
                  iframeProps: {
                    ref: iframeRef,
                    title: `MCP-UI iframe (${variant})`,
                  },
                  // Render-time data passed into iframe and merged with server metadata
                  iframeRenderData: {
                    theme: variant === 'raw-dark' ? 'dark' : 'light',
                    userId: 'demo-user-123',
                    debug: true,
                  },
                  autoResizeIframe: { height: true },
                }}
                remoteDomProps={{
                  library: radixComponentLibrary,
                  remoteElements: remoteElements,
                }}
              />
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default App;
