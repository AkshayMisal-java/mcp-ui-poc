CREATE TABLE ui_actions (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT,          -- optional: frontend session / user id
  resource_uri TEXT,        -- e.g. "ui://feedback/form"
  action_type TEXT NOT NULL, -- e.g. "tool" / "navigation" / "submit"
  tool_name TEXT,           -- when action triggers a tool
  payload JSONB,            -- full action payload as JSON
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- optional index to query by resource
CREATE INDEX idx_ui_actions_resource_uri ON ui_actions(resource_uri);


CREATE TABLE remote_dom_resources (
  id SERIAL PRIMARY KEY,
  uri TEXT NOT NULL UNIQUE,
  script TEXT NOT NULL,
  framework TEXT NOT NULL DEFAULT 'react',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);