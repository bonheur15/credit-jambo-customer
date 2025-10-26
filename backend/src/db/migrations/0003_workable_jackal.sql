CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"type" text NOT NULL,
	"amount" numeric(18, 2) NOT NULL,
	"reference" text,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now(),
	"created_by" uuid,
	"status" text
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;