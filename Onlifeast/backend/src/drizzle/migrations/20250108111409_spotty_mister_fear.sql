CREATE TYPE "public"."category" AS ENUM('Breakfast', 'Lunch', 'Supper');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('Pending', 'In transit', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('Paid', 'Failed');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('Admin', 'Student', 'Delivery personnel');--> statement-breakpoint
CREATE TABLE "delivery_peronnel" (
	"delivery_person_id" uuid PRIMARY KEY NOT NULL,
	"active_status" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "food" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" "category" NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity_available" integer DEFAULT 0 NOT NULL,
	"image_url" varchar(255),
	"description" varchar(500),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "food_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "inventory" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_id" uuid,
	"quantity_change" integer NOT NULL,
	"reason" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"food_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"total_price" numeric NOT NULL,
	"order_status" "order_status" DEFAULT 'Pending',
	"delivery_person_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" DEFAULT 'Paid',
	"payment_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "students" (
	"student_id" uuid PRIMARY KEY NOT NULL,
	"hostel_name" varchar(40) NOT NULL,
	"room_number" varchar(10) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"phone_number" varchar(15) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'Student',
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number")
);
--> statement-breakpoint
ALTER TABLE "delivery_peronnel" ADD CONSTRAINT "delivery_peronnel_delivery_person_id_users_id_fk" FOREIGN KEY ("delivery_person_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_student_id_students_student_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivery_person_id_delivery_peronnel_delivery_person_id_fk" FOREIGN KEY ("delivery_person_id") REFERENCES "public"."delivery_peronnel"("delivery_person_id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;