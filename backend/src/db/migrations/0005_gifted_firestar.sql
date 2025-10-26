CREATE TABLE "events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"aggregate_type" text NOT NULL,
	"aggregate_id" uuid,
	"event_type" text NOT NULL,
	"event_version" integer DEFAULT 1,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now()
);
