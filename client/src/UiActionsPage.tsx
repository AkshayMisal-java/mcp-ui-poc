import React, { useEffect, useMemo, useState } from 'react';

const SERVER_BASE = 'http://localhost:8081';

type UiActionRecord = {
  id: number;
  session_id: string | null;
  resource_uri: string | null;
  action_type: string;
  tool_name: string | null;
  payload: any;
  created_at: string;
};

const UiActionsPage: React.FC = () => {
  const [actions, setActions] = useState<UiActionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchActions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${SERVER_BASE}/ui-actions`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const json = await res.json();
        // Expect array; if your API wraps it, adjust here
        setActions(Array.isArray(json) ? json : json.rows ?? []);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load UI actions');
      } finally {
        setLoading(false);
      }
    };

    fetchActions();
  }, []);

  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

  const filteredActions = useMemo(() => {
    return actions
      .filter((a) => (typeFilter === 'all' ? true : a.action_type === typeFilter))
      .filter((a) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          (a.session_id ?? '').toLowerCase().includes(q) ||
          (a.resource_uri ?? '').toLowerCase().includes(q) ||
          (a.tool_name ?? '').toLowerCase().includes(q) ||
          a.action_type.toLowerCase().includes(q)
        );
      });
  }, [actions, typeFilter, search]);

  const shellStyle: React.CSSProperties = {
    minHeight: '100vh',
    margin: 0,
    padding: 24,
    boxSizing: 'border-box',
    background:
      'radial-gradient(circle at top, rgba(129,140,248,0.28), transparent 55%), radial-gradient(circle at bottom, rgba(45,212,191,0.22), #020617)',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'center',
    fontFamily,
  };

  const layoutStyle: React.CSSProperties = {
    width: '100%',
    maxWidth: 1280,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    color: '#e5e7eb',
  };

  const card: React.CSSProperties = {
    background: 'rgba(15,23,42,0.96)',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 24px 60px rgba(15,23,42,0.85)',
    border: '1px solid rgba(148,163,184,0.45)',
    boxSizing: 'border-box',
  };

  const headerTitle: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  };

  const badge: React.CSSProperties = {
    fontSize: 11,
    padding: '4px 10px',
    borderRadius: 999,
    border: '1px solid rgba(129,140,248,0.8)',
    background: 'rgba(30,64,175,0.6)',
    color: '#c7d2fe',
    textTransform: 'uppercase',
    fontWeight: 600,
  };

  const subText: React.CSSProperties = {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 6,
  };

  const controlsRow: React.CSSProperties = {
    marginTop: 16,
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const labelSmall: React.CSSProperties = {
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#9ca3af',
    marginBottom: 4,
  };

  const select: React.CSSProperties = {
    padding: '7px 9px',
    borderRadius: 999,
    border: '1px solid rgba(55,65,81,0.9)',
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.86), rgba(17,24,39,0.96))',
    color: '#e5e7eb',
    fontSize: 12,
    outline: 'none',
  };

  const input: React.CSSProperties = {
    padding: '7px 10px',
    borderRadius: 999,
    border: '1px solid rgba(55,65,81,0.9)',
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.86), rgba(17,24,39,0.96))',
    color: '#e5e7eb',
    fontSize: 12,
    outline: 'none',
    minWidth: 220,
  };

  const tableWrapper: React.CSSProperties = {
    marginTop: 16,
    borderRadius: 16,
    border: '1px solid rgba(31,41,55,1)',
    background:
      'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))',
    overflow: 'hidden',
  };

  const table: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  };

  const th: React.CSSProperties = {
    textAlign: 'left',
    padding: '10px 12px',
    background: 'rgba(15,23,42,0.98)',
    borderBottom: '1px solid rgba(31,41,55,1)',
    color: '#9ca3af',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  };

  const td: React.CSSProperties = {
    padding: '9px 12px',
    borderBottom: '1px solid rgba(31,41,55,0.85)',
    verticalAlign: 'top',
  };

  const pillType: React.CSSProperties = {
    fontSize: 10,
    padding: '3px 8px',
    borderRadius: 999,
    border: '1px solid rgba(55,65,81,1)',
    background: 'rgba(15,23,42,0.9)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const detailRow: React.CSSProperties = {
    background: 'rgba(15,23,42,0.98)',
  };

  const pre: React.CSSProperties = {
    margin: 0,
    padding: 10,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    fontSize: 11,
    background: 'rgba(15,23,42,1)',
    borderRadius: 10,
    border: '1px solid rgba(31,41,55,1)',
    color: '#e5e7eb',
    maxHeight: 220,
    overflow: 'auto',
  };

  const expandBtn: React.CSSProperties = {
    all: 'unset',
    cursor: 'pointer',
    fontSize: 11,
    color: '#bfdbfe',
    padding: '4px 8px',
    borderRadius: 999,
    border: '1px solid rgba(37,99,235,0.7)',
    background: 'rgba(15,23,42,0.9)',
  };

  const statusText: React.CSSProperties = {
    fontSize: 12,
    marginTop: 8,
    color: error ? '#fecaca' : '#9ca3af',
  };

  return (
    <div style={shellStyle}>
      <div style={layoutStyle}>
        <div style={card}>
          <div>
            <h1 style={headerTitle}>
              UI Action Log
              <span style={badge}>
                Analytics
              </span>
            </h1>
            <p style={subText}>
              All UI actions captured from the MCP-UI client and stored in PostgreSQL.
              Filter by type or search by session, resource, or tool.
            </p>
          </div>

          <div style={controlsRow}>
            <div>
              <div style={labelSmall}>Filter by type</div>
              <select
                style={select}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="tool">Tool</option>
                <option value="intent">Intent</option>
                <option value="notify">Notify</option>
                <option value="prompt">Prompt</option>
                <option value="link">Link</option>
              </select>
            </div>

            <div>
              <div style={labelSmall}>Search</div>
              <input
                style={input}
                placeholder="session id, resource, tool…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div style={statusText}>Loading actions from server…</div>
          )}
          {error && (
            <div style={statusText}>
              Error: {error}
            </div>
          )}

          <div style={tableWrapper}>
            <table style={table}>
              <thead>
                <tr>
                  <th style={th}>ID</th>
                  <th style={th}>Type</th>
                  <th style={th}>Tool</th>
                  <th style={th}>Resource</th>
                  <th style={th}>Session</th>
                  <th style={th}>Time</th>
                  <th style={th}></th>
                </tr>
              </thead>
              <tbody>
                {filteredActions.length === 0 && !loading && (
                  <tr>
                    <td style={{ ...td, color: '#9ca3af' }} colSpan={7}>
                      No actions found for the current filters.
                    </td>
                  </tr>
                )}

                {filteredActions.map((action) => {
                  const isExpanded = expandedId === action.id;
                  return (
                    <React.Fragment key={action.id}>
                      <tr>
                        <td style={td}>{action.id}</td>
                        <td style={td}>
                          <span style={pillType}>{action.action_type}</span>
                        </td>
                        <td style={td}>
                          {action.tool_name ?? <span style={{ color: '#6b7280' }}>—</span>}
                        </td>
                        <td style={td}>
                          <code>{action.resource_uri ?? '—'}</code>
                        </td>
                        <td style={td}>
                          {action.session_id ?? <span style={{ color: '#6b7280' }}>—</span>}
                        </td>
                        <td style={td}>
                          {new Date(action.created_at).toLocaleString()}
                        </td>
                        <td style={td}>
                          <button
                            style={expandBtn}
                            onClick={() =>
                              setExpandedId(isExpanded ? null : action.id)
                            }
                          >
                            {isExpanded ? 'Hide payload' : 'View payload'}
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={detailRow}>
                          <td style={td} colSpan={7}>
                            <pre style={pre}>
                              {JSON.stringify(action.payload, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ ...statusText, marginTop: 10 }}>
            Showing {filteredActions.length} of {actions.length} actions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiActionsPage;
