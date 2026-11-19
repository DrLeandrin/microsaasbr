CREATE TABLE IF NOT EXISTS schema_migrations (
  id text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS entries (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text NOT NULL,
  explanation text,
  integrations jsonb NOT NULL DEFAULT '[]'::jsonb,
  category text NOT NULL,
  difficulty text,
  difficulty_note text,
  author_name text,
  author_url text,
  source_url text,
  source_name text,
  source_date date,
  license_note text,
  node_count integer,
  json_downloadable boolean NOT NULL DEFAULT false,
  hosted_json text,
  price text,
  price_as_shown text,
  purchase_url text,
  listed boolean NOT NULL DEFAULT true,
  added_at date NOT NULL DEFAULT CURRENT_DATE,
  popularity integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS entries_category_idx ON entries (category);
CREATE INDEX IF NOT EXISTS entries_listed_idx ON entries (published, listed);

CREATE TABLE IF NOT EXISTS submissions (
  id serial PRIMARY KEY,
  title text NOT NULL,
  source_url text,
  workflow_json text,
  description text NOT NULL,
  integrations text NOT NULL,
  category text NOT NULL,
  author_name text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  entry_id integer
);

CREATE TABLE IF NOT EXISTS signups (
  id serial PRIMARY KEY,
  email text NOT NULL UNIQUE,
  resend_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS searches (
  id serial PRIMARY KEY,
  query text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pageviews (
  id serial PRIMARY KEY,
  path text NOT NULL,
  day date NOT NULL,
  count integer NOT NULL DEFAULT 0,
  UNIQUE (path, day)
);

CREATE TABLE IF NOT EXISTS sponsor_weeks (
  id serial PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  url text NOT NULL,
  bar_text text NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  newsletter_line text,
  slot text NOT NULL DEFAULT 'semana',
  category_slug text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sponsor_clicks (
  id serial PRIMARY KEY,
  sponsor_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sponsor_inquiries (
  id serial PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  plan text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS errors (
  id serial PRIMARY KEY,
  message text NOT NULL,
  stack text,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO schema_migrations (id) VALUES ('0001_init') ON CONFLICT DO NOTHING;
