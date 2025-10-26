CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"admin_id" uuid,
	"action" text,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now()
);
