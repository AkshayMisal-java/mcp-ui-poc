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