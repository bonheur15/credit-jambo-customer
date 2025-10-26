CREATE TABLE "account_balance_snapshots" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"account_id" uuid,
	"balance" numeric(18, 2) NOT NULL,
	"last_tx_id" uuid,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account_balance_snapshots" ADD CONSTRAINT "account_balance_snapshots_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;