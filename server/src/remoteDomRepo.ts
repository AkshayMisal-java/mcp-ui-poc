// remoteDomRepo.ts
import { query } from './db';

export interface RemoteDomResource {
  id: number;
  uri: string;
  script: string;
  framework: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export async function upsertRemoteDom(options: {
  uri: string;
  script: string;
  framework?: string;
  description?: string | null;
}): Promise<RemoteDomResource> {
  const { uri, script, framework = 'react', description = null } = options;

  const result = await query<RemoteDomResource>(
    `
    INSERT INTO remote_dom_resources (uri, script, framework, description)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (uri)
    DO UPDATE SET
      script = EXCLUDED.script,
      framework = EXCLUDED.framework,
      description = EXCLUDED.description,
      updated_at = NOW()
    RETURNING *;
    `,
    [uri, script, framework, description],
  );

  return result.rows[0];
}

export async function getRemoteDomByUri(uri: string): Promise<RemoteDomResource | null> {
  const result = await query<RemoteDomResource>(
    `SELECT * FROM remote_dom_resources WHERE uri = $1`,
    [uri],
  );
  return result.rows[0] ?? null;
}
