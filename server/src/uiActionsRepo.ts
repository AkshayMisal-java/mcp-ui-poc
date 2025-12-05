// uiActionsRepo.ts
import { query } from './db';

export interface UiActionRecord {
  id: number;
  session_id: string | null;
  resource_uri: string | null;
  action_type: string;
  tool_name: string | null;
  payload: any;
  created_at: string;
}

export interface SaveUiActionInput {
  sessionId?: string;
  resourceUri?: string;
  actionType: string;
  toolName?: string;
  payload: any;
}

export async function saveUiAction(input: SaveUiActionInput): Promise<UiActionRecord> {
  const { sessionId, resourceUri, actionType, toolName, payload } = input;

  const result = await query<UiActionRecord>(
    `
    INSERT INTO ui_actions (
      session_id,
      resource_uri,
      action_type,
      tool_name,
      payload
    )
    VALUES ($1, $2, $3, $4, $5::jsonb)
    RETURNING *;
    `,
    [sessionId ?? null, resourceUri ?? null, actionType, toolName ?? null, JSON.stringify(payload)],
  );

  return result.rows[0];
}

export interface ListUiActionsFilter {
  type?: string;    // e.g. "tool", "intent", etc.
  search?: string;  // search in session_id, resource_uri, tool_name, action_type
  limit?: number;
  offset?: number;
}

export async function listUiActions(
  filter: ListUiActionsFilter = {},
): Promise<UiActionRecord[]> {
  const { type, search, limit = 100, offset = 0 } = filter;

  const where: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (type && type !== 'all') {
    where.push(`action_type = $${paramIndex++}`);
    params.push(type);
  }

  if (search && search.trim()) {
    where.push(
      `(session_id ILIKE $${paramIndex} OR resource_uri ILIKE $${paramIndex} OR tool_name ILIKE $${paramIndex} OR action_type ILIKE $${paramIndex})`,
    );
    params.push(`%${search.trim()}%`);
    paramIndex++;
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

  params.push(limit);
  params.push(offset);

  const sql = `
    SELECT
      id,
      session_id,
      resource_uri,
      action_type,
      tool_name,
      payload,
      created_at
    FROM ui_actions
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${paramIndex++}
    OFFSET $${paramIndex++};
  `;

  const result = await query<UiActionRecord>(sql, params);
  return result.rows;
}