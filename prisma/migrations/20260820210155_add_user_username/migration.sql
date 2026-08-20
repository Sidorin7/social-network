-- Add username, backfilled from the email local-part for existing users.
-- Collisions (same local-part) get a numeric suffix via row_number().
ALTER TABLE "users" ADD COLUMN "username" TEXT;

WITH base AS (
  SELECT
    id,
    COALESCE(
      NULLIF(regexp_replace(lower(split_part(coalesce(email, ''), '@', 1)), '[^a-z0-9_]', '', 'g'), ''),
      'user'
    ) AS base_username
  FROM "users"
),
numbered AS (
  SELECT id, base_username,
    row_number() OVER (PARTITION BY base_username ORDER BY id) AS rn
  FROM base
)
UPDATE "users" u
SET "username" = CASE WHEN n.rn = 1 THEN n.base_username ELSE n.base_username || n.rn::text END
FROM numbered n
WHERE u.id = n.id;

ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
