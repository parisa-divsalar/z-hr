ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "has_used_free_plan" BOOLEAN NOT NULL DEFAULT FALSE;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "plan_status" TEXT NULL;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "payment_failed" BOOLEAN NULL DEFAULT FALSE;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "just_converted" BOOLEAN NULL DEFAULT FALSE;

ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "last_payment_at" TIMESTAMP NULL;

-- 2) CoinPackages table (required by backend; FREE amount is read from here)
CREATE TABLE IF NOT EXISTS "coin_packages" (
  "id" SERIAL PRIMARY KEY,
  "package_name" TEXT NOT NULL,
  "coin_amount" INTEGER NOT NULL,
  "price_aed" NUMERIC(10,2) NOT NULL DEFAULT 0,
  "aed_per_coin" NUMERIC(10,4),
  "calculator_value_aed" NUMERIC(10,2),
  "user_saving_percent" INTEGER
);

INSERT INTO "coin_packages" ("package_name", "coin_amount", "price_aed", "aed_per_coin", "calculator_value_aed", "user_saving_percent")
SELECT 'Free', 6, 0, 0, 0, 0
WHERE NOT EXISTS (
  SELECT 1 FROM "coin_packages" WHERE "price_aed" = 0 AND "package_name" ILIKE '%free%'
);

ALTER TABLE "fiserv_transactions"
  ADD COLUMN IF NOT EXISTS "plan_id" TEXT NULL;

ALTER TABLE "fiserv_transactions"
  ADD COLUMN IF NOT EXISTS "coin_package_id" INTEGER NULL REFERENCES "coin_packages"("id") ON DELETE SET NULL;

ALTER TABLE "fiserv_transactions"
  ADD COLUMN IF NOT EXISTS "purchased_coin_amount" INTEGER NULL;

ALTER TABLE "fiserv_transactions"
  ADD COLUMN IF NOT EXISTS "raw_webhook_event_id" TEXT NULL;

ALTER TABLE "fiserv_transactions"
  ADD COLUMN IF NOT EXISTS "raw_webhook_payload" JSONB NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "fiserv_transactions_raw_webhook_event_id_unique"
  ON "fiserv_transactions" ("raw_webhook_event_id")
  WHERE "raw_webhook_event_id" IS NOT NULL;

UPDATE "users"
SET "coin" = 6
WHERE ("coin" IS NULL OR "coin" = 0)
  AND "has_used_free_plan" = FALSE;

