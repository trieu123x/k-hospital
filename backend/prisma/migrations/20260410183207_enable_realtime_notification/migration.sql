-- DropIndex
DROP INDEX "user_events_metadata_idx";

-- CreateIndex
CREATE INDEX "user_events_metadata_idx" ON "user_events" USING GIN ("metadata" jsonb_path_ops);

DO $$
BEGIN
  -- Cấp quyền cho khách vãng lai (anon) nếu role này tồn tại
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    GRANT SELECT ON TABLE "notifications" TO anon;
  END IF;

  -- Cấp quyền cho user đã đăng nhập (authenticated) nếu role này tồn tại
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    GRANT SELECT ON TABLE "notifications" TO authenticated;
  END IF;
END
$$;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE "notifications";
  END IF;
END
$$;

ALTER TABLE "notifications" REPLICA IDENTITY FULL;