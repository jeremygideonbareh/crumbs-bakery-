-- SECURITY DEFINER RPCs for reviews moderation
-- Run this in Supabase Dashboard → SQL Editor after all other migrations

-- RPC: list all reviews (including unapproved)
CREATE OR REPLACE FUNCTION admin_read_reviews(admin_token text)
RETURNS SETOF reviews
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN QUERY SELECT * FROM reviews ORDER BY created_at DESC;
  END IF;
END;
$$;

-- RPC: count unapproved reviews
CREATE OR REPLACE FUNCTION admin_count_unapproved_reviews(admin_token text)
RETURNS integer
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    RETURN (SELECT count(*) FROM reviews WHERE approved = false);
  END IF;
  RETURN 0;
END;
$$;

-- RPC: toggle review approval status
CREATE OR REPLACE FUNCTION admin_toggle_review_approval(admin_token text, review_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    UPDATE reviews SET approved = NOT approved WHERE id = review_id;
  END IF;
END;
$$;

-- RPC: delete review
CREATE OR REPLACE FUNCTION admin_delete_review(admin_token text, review_id bigint)
RETURNS void
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM admin_config WHERE key = 'password_hash' AND value = extensions.crypt(admin_token, value)) THEN
    DELETE FROM reviews WHERE id = review_id;
  END IF;
END;
$$;
