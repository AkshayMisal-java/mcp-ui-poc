import {
  UIResourceRenderer,
} from '@mcp-ui/client';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { radixComponentLibrary } from '../radix';
import '../radix-styles.css';
import { remoteElements } from '../radix';

const SERVER_BASE = 'http://localhost:8081';

type RemoteDomScriptMeta = {
  uri: string;
  name?: string;
  description?: string;
};

function Configurator() {
  const [scriptContent, setScriptContent] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [saveResponseValue, setSaveResponseValue] = useState('');
  const [isPending, startTransition] = useTransition();

  const [scripts, setScripts] = useState<RemoteDomScriptMeta[]>([]);
  const [selectedUri, setSelectedUri] = useState<string>('');
  const [listLoading, setListLoading] = useState(false);
  const [loading, setLoading] = useState(false); // loading for the currently selected script
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- helper to load a single script by uri ---
  async function loadScript(uri: string) {
    if (!uri) return;
    setLoading(true);
    setError(null);
    setSaveResponseValue('');
    try {
      const res = await fetch(`${SERVER_BASE}/remote-dom/script?uri=${encodeURIComponent(uri)}`);
      const json = await res.json();
      console.log('loadScript response:', json);
      if (json && json.script) {
        setScriptContent(json.script);
        setInputValue(json.script);
      } else {
        setError(json.error ?? 'Failed to load script');
        setScriptContent('');
        setInputValue('');
      }
    } catch (err: any) {
      setError(err?.message ?? 'Fetch error');
      setScriptContent('');
      setInputValue('');
    } finally {
      setLoading(false);
    }
  }

  // 1) Load list of scripts on mount
  useEffect(() => {
    const fetchList = async () => {
      setListLoading(true);
      setError(null);
      try {
        const res = await fetch(`${SERVER_BASE}/remote-dom/scripts`);
        const json = await res.json();
        console.log('scripts list response: ', json);

        const items: RemoteDomScriptMeta[] = Array.isArray(json)
          ? json
          : Array.isArray(json.scripts)
          ? json.scripts
          : [];

        setScripts(items);

        if (items.length > 0) {
          const initialUri = items[0].uri;
          setSelectedUri(initialUri);
          await loadScript(initialUri);
        } else {
          setError('No Remote DOM scripts found.');
        }
      } catch (err: any) {
        setError(err?.message ?? 'Failed to load scripts list');
      } finally {
        setListLoading(false);
      }
    };

    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Debounce the script content updates for preview
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
  }, [inputValue, startTransition]);

  const mockResourceReact = useMemo(
    () => ({
      mimeType: 'application/vnd.mcp-ui.remote-dom+javascript; framework=react',
      text: scriptContent,
    }),
    [scriptContent],
  );

  const postCall = async () => {
    if (!selectedUri) {
      setSaveResponseValue('Error: Please select a script resource to save.');
      return;
    }

    try {
      setSaving(true);
      setSaveResponseValue('');
      const json = await apiCall(`${SERVER_BASE}/remote-dom/script`, {
        uri: selectedUri,
        script: inputValue,
      });
      setSaveResponseValue(json.success ?? json.message ?? 'Saved!');
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
    flexWrap: 'wrap',
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

  const selectRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 12,
    flexWrap: 'wrap',
  };

  const selectStyle: React.CSSProperties = {
    minWidth: 220,
    padding: '7px 10px',
    borderRadius: 999,
    border: '1px solid rgba(31,41,55,0.9)',
    background:
      'linear-gradient(135deg, rgba(235, 236, 240, 0.96), rgba(215, 217, 220, 1))',
    color: '#0c0c0cff',
    fontSize: 12,
    outline: 'none',
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
              Pick a Remote DOM script from the list, edit it, and see changes reflected
              instantly in the preview panel. Click <b>Save</b> to persist the selected
              script back to your Node + PostgreSQL backend.
            </p>
          </div>

          {/* Script selector */}
          <div style={selectRow}>
            <div>
              <span style={label}>Script Resource</span>
              <select
                style={selectStyle}
                value={selectedUri}
                disabled={listLoading || scripts.length === 0}
                onChange={async (e) => {
                  const nextUri = e.target.value;
                  setSelectedUri(nextUri);
                  setInputValue('');
                  setScriptContent('');
                  setSaveResponseValue('');
                  if (nextUri) {
                    await loadScript(nextUri);
                  }
                }}
              >
                <option value="">
                  {listLoading ? 'Loading scripts…' : 'Select a script'}
                </option>
                {scripts.map((s) => (
                  <option key={s.uri} value={s.uri}>
                    {s.name || s.uri}
                  </option>
                ))}
              </select>
              {selectedUri && (
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
                  Editing script for: <code>{selectedUri}</code>
                </p>
              )}
            </div>

            <span style={subtlePill}>
              Scripts loaded: <strong>{scripts.length}</strong>
            </span>
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
            Changes are auto-applied to the preview after a short pause. The{' '}
            <b>Save script</b> button will update the currently selected resource in the
            database.
          </p>

          {loading && (
            <p style={{ marginTop: 8, fontSize: 12, color: '#e5e7eb' }}>
              Loading script content…
            </p>
          )}

          {error && <div style={errorBanner}>Error: {error}</div>}

          <div style={buttonRow}>
            <button
              style={saveButton}
              onClick={postCall}
              disabled={saving || loading || listLoading || !selectedUri}
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
                This panel renders the selected script using{' '}
                <code>UIResourceRenderer</code> and your custom{' '}
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
                key={`radix-${selectedUri}-${scriptContent}`}
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
                Choose a script from the dropdown and start editing the Remote DOM script
                on the left.
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

export default Configurator;
