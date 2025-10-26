CREATE TABLE "device_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"device_id" uuid,
	"admin_id" uuid,
	"status" text,
	"created_at" timestamp DEFAULT now(),
	"note" text
);
--> statement-breakpoint
ALTER TABLE "device_verifications" ADD CONSTRAINT "device_verifications_device_id_devices_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."devices"("id") ON DELETE no action ON UPDATE no action;