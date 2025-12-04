import {
  UIResourceRenderer,
  remoteTextDefinition,
  remoteButtonDefinition,
  remoteStackDefinition,
  remoteImageDefinition,
} from '@mcp-ui/client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { radixComponentLibrary } from '../radix';
import '../radix-styles.css';
import { remoteElements } from '../remoteDomLibrary';

const SERVER_BASE = 'http://localhost:8081';

const remoteDomScript1 = `
      const stack = document.createElement('ui-stack');
      stack.setAttribute('direction', 'vertical');
      stack.setAttribute('spacing', '20');
      stack.setAttribute('align', 'center');

      const text1 = document.createElement('ui-text');
      text1.setAttribute('content', 'Do you want to proceed?');

      const button = document.createElement('ui-button');
      button.setAttribute('label', 'Buy');
      button.setAttribute('variant', 'soft');

      button.addEventListener('press', () => {
        window.parent.postMessage(
          {
            type: 'tool',
            payload: {
              toolName: 'uiInteraction',
              params: {
                action: 'buy-button-click',
                from: 'remote-dom-custom-library',
                clickedAt: new Date().toISOString(),
              }
            }
          },
          '*'
        );
      });

      stack.appendChild(text1);
      stack.appendChild(button);
      root.appendChild(stack);
    `;

function CreateDom() {
  const [scriptContent, setScriptContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [saveResponseValue, setSaveResponseValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load script from server on mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${SERVER_BASE}/remote-dom/script`)
      .then((res) => res.json())
      .then((json) => {
        console.log('server response: ', json);
        if (json && json.script) {
          setScriptContent(json.script);
          setInputValue(json.script);
        } else {
          setError(json.error ?? 'Failed to load script');
        }
      })
      .catch((err) => {
        setError(err.message ?? 'Fetch error');
      })
      .finally(() => setLoading(false));
  }, []);

  // Debounce the script content updates for preview
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setScriptContent(inputValue);
        setSaveResponseValue('');
      });
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue]);

  const mockResourceReact = useMemo(
    () => ({
      mimeType: 'application/vnd.mcp-ui.remote-dom+javascript; framework=react',
      text: scriptContent,
    }),
    [scriptContent],
  );

  const postCall = async () => {
    try {
      setSaving(true);
      setSaveResponseValue('');
      const json = await apiCall(`${SERVER_BASE}/remote-dom`, { script: inputValue });
      setSaveResponseValue(json.success ?? 'Saved!');
    } catch (e: any) {
      setSaveResponseValue(`Error: ${e?.message ?? 'Failed to save'}`);
    } finally {
      setSaving(false);
    }
  };

  async function apiCall(resourceEndpoint: string, input: any) {
    const res = await fetch(resourceEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });
    const json = await res.json();
    return json;
  }

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const outerShell: React.CSSProperties = {
    minHeight: '100vh',
    padding: '24px',
    boxSizing: 'border-box',
    background:
      'radial-gradient(circle at top left, rgba(129,140,248,0.28), transparent 55%), radial-gradient(circle at bottom right, rgba(45,212,191,0.22), #020617)',
    fontFamily,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
  };

  const layout: React.CSSProperties = {
    width: '100%',
    maxWidth: 1280,
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
    gap: 24,
    alignItems: 'flex-start',
  };

  const cardBase: React.CSSProperties = {
    borderRadius: 20,
    padding: 20,
    boxSizing: 'border-box',
    background: 'rgba(15,23,42,0.96)',
    border: '1px solid rgba(148,163,184,0.45)',
    boxShadow: '0 24px 60px rgba(15,23,42,0.85)',
    color: '#e5e7eb',
  };

  const headerTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    letterSpacing: '0.02em',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const headerBadge: React.CSSProperties = {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: '1px solid rgba(129,140,248,0.8)',
    background: 'rgba(30,64,175,0.6)',
    color: '#c7d2fe',
    textTransform: 'uppercase',
    fontWeight: 600,
  };

  const headerSub: React.CSSProperties = {
    marginTop: 8,
    fontSize: 13,
    color: '#9ca3af',
    lineHeight: 1.6,
  };

  const label: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.09em',
    color: '#9ca3af',
    marginBottom: 6,
    display: 'block',
  };

  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '340px',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    fontSize: '12px',
    padding: '12px 14px',
    borderRadius: 12,
    resize: 'vertical',
    background: 'linear-gradient(135deg, #020617, #030712)',
    color: '#e5e7eb',
    border: '1px solid rgba(31,41,55,0.9)',
    boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.7)',
    lineHeight: 1.5,
    outline: 'none',
  };

  const helperText: React.CSSProperties = {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
  };

  const buttonRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  };

  const saveButton: React.CSSProperties = {
    all: 'unset',
    padding: '0 18px',
    height: 38,
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    cursor: saving ? 'default' : 'pointer',
    background:
      'linear-gradient(135deg, rgba(129,140,248,1), rgba(79,70,229,1))',
    color: '#eef2ff',
    border: '1px solid rgba(129,140,248,0.9)',
    boxShadow: '0 12px 30px rgba(79,70,229,0.5)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
  };

  const subtlePill: React.CSSProperties = {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    background: 'rgba(15,23,42,0.96)',
    border: '1px solid rgba(55,65,81,0.9)',
    color: '#9ca3af',
  };

  const statusText: React.CSSProperties = {
    fontSize: 12,
    color: saveResponseValue?.toLowerCase().startsWith('error') ? '#fecaca' : '#bbf7d0',
  };

  const previewCard: React.CSSProperties = {
    ...cardBase,
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92))',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  };

  const previewHeader: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  };

  const previewTitle: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 600,
    margin: 0,
  };

  const previewSubtitle: React.CSSProperties = {
    marginTop: 4,
    fontSize: 12,
    color: '#9ca3af',
  };

  const previewShell: React.CSSProperties = {
    marginTop: 4,
    borderRadius: 16,
    padding: 12,
    background: 'radial-gradient(circle at top, #0b1120, #020617)',
    border: '1px solid rgba(31,41,55,1)',
    minHeight: 260,
    boxShadow: '0 18px 45px rgba(15,23,42,0.9)',
  };

  const previewEmpty: React.CSSProperties = {
    height: '100%',
    borderRadius: 12,
    border: '1px dashed rgba(55,65,81,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  };

  const errorBanner: React.CSSProperties = {
    marginTop: 10,
    padding: '8px 10px',
    borderRadius: 10,
    background: 'rgba(248,113,113,0.12)',
    border: '1px solid rgba(248,113,113,0.5)',
    color: '#fecaca',
    fontSize: 12,
  };

  return (
    <div style={{ ...outerShell, opacity: isPending ? 0.9 : 1 }}>
      <div style={layout}>
        {/* Left: Editor */}
        <div style={cardBase}>
          <div style={{ marginBottom: 16 }}>
            <h1 style={headerTitle}>
              Remote DOM Editor
              <span style={headerBadge}>Live Preview</span>
            </h1>
            <p style={headerSub}>
              Edit the server&#39;s <code>remoteDom</code> script and see changes reflected
              instantly in the preview panel. Perfect for iterating on UI flows powered by
              Remote DOM.
            </p>
          </div>

          <label style={label}>
            Script
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={textareaStyle}
              placeholder="Enter your Remote DOM script here..."
            />
          </label>

          <p style={helperText}>
            Changes are auto-applied to the preview after a short pause. Click <b>Save</b> to
            persist the script to your Node + PostgreSQL backend.
          </p>

          {loading && (
            <p style={{ marginTop: 8, fontSize: 12, color: '#e5e7eb' }}>
              Loading script from server…
            </p>
          )}

          {error && <div style={errorBanner}>Error loading script: {error}</div>}

          <div style={buttonRow}>
            <button
              style={saveButton}
              onClick={postCall}
              disabled={saving || !!loading}
            >
              {saving ? (
                <>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '999px',
                      border: '2px solid rgba(238,242,255,0.5)',
                      borderTopColor: 'transparent',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Saving…
                </>
              ) : (
                <>Save script</>
              )}
            </button>

            <span style={subtlePill}>
              Preview: <strong>React Remote DOM</strong>
            </span>

            {saveResponseValue && (
              <span style={statusText}>{saveResponseValue}</span>
            )}
          </div>
        </div>

        {/* Right: Preview */}
        <div style={previewCard}>
          <div style={previewHeader}>
            <div>
              <h2 style={previewTitle}>Live Preview</h2>
              <p style={previewSubtitle}>
                This panel renders your script using{' '}
                <code>UIResourceRenderer</code> and the custom{' '}
                <code>radixComponentLibrary</code>.
              </p>
            </div>
            <span style={subtlePill}>
              Script status:{' '}
              <strong style={{ color: '#e5e7eb' }}>
                {scriptContent.trim() ? 'Loaded' : 'Empty'}
              </strong>
            </span>
          </div>

          <div style={previewShell}>
            {scriptContent.trim() ? (
              <UIResourceRenderer
                key={`radix-${scriptContent}`}
                resource={mockResourceReact}
                remoteDomProps={{
                  library: radixComponentLibrary,
                  remoteElements: remoteElements,
                }}
              />
            ) : (
              <div style={previewEmpty}>
                No script content to render yet.
                <br />
                Start by editing the Remote DOM script on the left.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tiny spinner animation keyframes (inline) */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default CreateDom;
