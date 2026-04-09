-- Servers table (D-05)
CREATE TABLE servers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  ip TEXT NOT NULL,
  port INTEGER NOT NULL DEFAULT 8888,
  description TEXT,
  banner_url TEXT,
  is_online BOOLEAN NOT NULL DEFAULT false,
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE servers ENABLE ROW LEVEL SECURITY;

-- Anyone can read servers (public server list)
CREATE POLICY "servers_select_public"
ON servers FOR SELECT
USING (true);

-- Only the owner can insert their server
CREATE POLICY "servers_insert_owner"
ON servers FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- Only the owner can update their server
CREATE POLICY "servers_update_owner"
ON servers FOR UPDATE
USING (auth.uid() = owner_id);

-- Only the owner can delete their server
CREATE POLICY "servers_delete_owner"
ON servers FOR DELETE
USING (auth.uid() = owner_id);
