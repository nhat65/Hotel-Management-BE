import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1757641778918 implements MigrationInterface {
  name = ' $npmConfigName1757641778918';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "token" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "ip_address" character varying, "user_agent" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "isRevoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."account_role_enum" AS ENUM('admin', 'receptionist', 'maintenance', 'security')`,
    );
    await queryRunner.query(
      `CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "role" "public"."account_role_enum" NOT NULL, "staff_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_2e36426e0642f08248eebe95dc" UNIQUE ("staff_id"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attendance_shift_enum" AS ENUM('morning', 'afternoon', 'full')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."attendance_status_enum" AS ENUM('present', 'late', 'absent')`,
    );
    await queryRunner.query(
      `CREATE TABLE "attendance" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "date" date NOT NULL, "shift" "public"."attendance_shift_enum" NOT NULL, "status" "public"."attendance_status_enum" NOT NULL, "staff_id" uuid NOT NULL, "check_in" TIME NOT NULL, "check_out" TIME NOT NULL, CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "salary" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "month" date NOT NULL, "base_salary" numeric(8,2) NOT NULL, "bonus" numeric(8,2) NOT NULL, "deduction" numeric(8,2) NOT NULL, "net_salary" numeric(8,2) NOT NULL, "payment_date" TIMESTAMP NOT NULL, "note" character varying NOT NULL, "staff_id" uuid NOT NULL, CONSTRAINT "PK_3ac75d9585433a6264e618a6503" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "customer" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying NOT NULL, "phone_number" integer NOT NULL, "date_of_birth" date NOT NULL, "identify" character varying NOT NULL, "booking_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "equipment_maintenance" ("id" uuid NOT NULL, "maintenance_type" character varying NOT NULL, "description" character varying NOT NULL, "start_date" date NOT NULL, "end_date" date NOT NULL, "staff_id" uuid NOT NULL, "hotel_equipment_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ea3b5d19cc04640d2aa3e3e7311" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."room_equipment_status_enum" AS ENUM('available', 'in_use', 'broken', 'maintenance')`,
    );
    await queryRunner.query(
      `CREATE TABLE "room_equipment" ("id" uuid NOT NULL, "name" character varying NOT NULL, "category" character varying NOT NULL, "quantity" integer NOT NULL, "status" "public"."room_equipment_status_enum" NOT NULL, "purchase_date" date NOT NULL, "warranty_expiry" date NOT NULL, "note" text NOT NULL, "room_detail_id" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_dc7fc78653d39b1b4755474b27c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."room_status_enum" AS ENUM('available', 'occupied', 'maintenance', 'cleaning')`,
    );
    await queryRunner.query(
      `CREATE TABLE "room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "number" integer NOT NULL, "type" character varying NOT NULL, "status" "public"."room_status_enum" NOT NULL, "capacity" integer NOT NULL, "floor" integer NOT NULL, "image" character varying NOT NULL, "description" text NOT NULL, "price_per_day" numeric(8,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."service_status_enum" AS ENUM('active', 'inactive')`,
    );
    await queryRunner.query(
      `CREATE TABLE "service" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" text NOT NULL, "price" numeric(8,2) NOT NULL, "unit" character varying NOT NULL, "status" "public"."service_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_85a21558c006647cd76fdce044b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payment_method_enum" AS ENUM('cash', 'credit_card', 'bank_transfer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "method" "public"."payment_method_enum" NOT NULL, "amount_paid" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "invoice_id" uuid, CONSTRAINT "REL_20cc84d8a2274ae86f551360c1" UNIQUE ("invoice_id"), CONSTRAINT "PK_fcaec7df5adf9cac408c686b2ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "invoice" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "time" TIMESTAMP NOT NULL, "room_amount" numeric(8,2) NOT NULL, "service_amount" numeric(8,2) NOT NULL, "subtotal" numeric(8,2) NOT NULL, "tax_amount" numeric(8,2) NOT NULL, "discount_amount" numeric(8,2), "total_amount" numeric(8,2) NOT NULL, "note" character varying, "booking_detail_id" uuid NOT NULL, "created_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_fdf2e8d0c8b8869260fa3a1c9b" UNIQUE ("booking_detail_id"), CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "room_quantity" integer, "service_quantity" integer, "room_price" numeric(8,2), "service_price" numeric(8,2), "booking_id" uuid NOT NULL, "room_id" uuid, "service_id" uuid, CONSTRAINT "PK_53e6fd8cc006caf8abe22700012" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."booking_status_enum" AS ENUM('pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "public"."booking_status_enum" NOT NULL, "expected_check_in" TIMESTAMP NOT NULL, "expected_check_out" TIMESTAMP NOT NULL, "special_requests" character varying, "total_guest" integer NOT NULL, "created_by" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_49171efc69702ed84c812f33540" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."staff_position_enum" AS ENUM('admin', 'receptionist', 'maintenance', 'security')`,
    );
    await queryRunner.query(
      `CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying NOT NULL, "phone_number" character varying NOT NULL, "avatar_url" character varying, "address" character varying NOT NULL, "day_of_birth" date NOT NULL, "position" "public"."staff_position_enum" NOT NULL, "email" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_by" character varying, "updated_by" character varying, CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_unit_enum" AS ENUM('piece', 'kilogram', 'liter', 'meter')`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "item_name" character varying NOT NULL, "quantity" bigint NOT NULL, "price" numeric(8,2) NOT NULL, "unit" "public"."inventory_unit_enum" NOT NULL, "min_stock_level" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_f8e6c51db7655e2f7084f615681" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" ADD CONSTRAINT "FK_2e36426e0642f08248eebe95dc3" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" ADD CONSTRAINT "FK_99d7d43e6a69506c5f71095a108" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "salary" ADD CONSTRAINT "FK_475751c5e2434ed5c7ecc050d6b" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" ADD CONSTRAINT "FK_74e8e8b9f91fdfd7a5159c18bf1" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "FK_a704b7c43c8e85919f41f66cd61" FOREIGN KEY ("hotel_equipment_id") REFERENCES "room_equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "FK_d9f83f42da2010a83a147b3ad79" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_equipment" ADD CONSTRAINT "FK_4a86f32ff8c7520bec440f8db92" FOREIGN KEY ("room_detail_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_20cc84d8a2274ae86f551360c11" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_fdf2e8d0c8b8869260fa3a1c9bd" FOREIGN KEY ("booking_detail_id") REFERENCES "booking_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD CONSTRAINT "FK_936f7b726cbffb567bc1ae72294" FOREIGN KEY ("created_by") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_be5cd3c6d04d0ce156fcadd7e72" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_57f3269d238d3af5420e6e4fe89" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_0e8d3e0aed74638ca7f0a06caba" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_2b67c0363562a428475fdf830fe" FOREIGN KEY ("created_by") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_2b67c0363562a428475fdf830fe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_0e8d3e0aed74638ca7f0a06caba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_57f3269d238d3af5420e6e4fe89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_be5cd3c6d04d0ce156fcadd7e72"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_936f7b726cbffb567bc1ae72294"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_fdf2e8d0c8b8869260fa3a1c9bd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_20cc84d8a2274ae86f551360c11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_equipment" DROP CONSTRAINT "FK_4a86f32ff8c7520bec440f8db92"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" DROP CONSTRAINT "FK_d9f83f42da2010a83a147b3ad79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" DROP CONSTRAINT "FK_a704b7c43c8e85919f41f66cd61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "customer" DROP CONSTRAINT "FK_74e8e8b9f91fdfd7a5159c18bf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "salary" DROP CONSTRAINT "FK_475751c5e2434ed5c7ecc050d6b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "attendance" DROP CONSTRAINT "FK_99d7d43e6a69506c5f71095a108"`,
    );
    await queryRunner.query(
      `ALTER TABLE "account" DROP CONSTRAINT "FK_2e36426e0642f08248eebe95dc3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_f8e6c51db7655e2f7084f615681"`,
    );
    await queryRunner.query(`DROP TABLE "inventory"`);
    await queryRunner.query(`DROP TYPE "public"."inventory_unit_enum"`);
    await queryRunner.query(`DROP TABLE "staff"`);
    await queryRunner.query(`DROP TYPE "public"."staff_position_enum"`);
    await queryRunner.query(`DROP TABLE "booking"`);
    await queryRunner.query(`DROP TYPE "public"."booking_status_enum"`);
    await queryRunner.query(`DROP TABLE "booking_details"`);
    await queryRunner.query(`DROP TABLE "invoice"`);
    await queryRunner.query(`DROP TABLE "payment"`);
    await queryRunner.query(`DROP TYPE "public"."payment_method_enum"`);
    await queryRunner.query(`DROP TABLE "service"`);
    await queryRunner.query(`DROP TYPE "public"."service_status_enum"`);
    await queryRunner.query(`DROP TABLE "room"`);
    await queryRunner.query(`DROP TYPE "public"."room_status_enum"`);
    await queryRunner.query(`DROP TABLE "room_equipment"`);
    await queryRunner.query(`DROP TYPE "public"."room_equipment_status_enum"`);
    await queryRunner.query(`DROP TABLE "equipment_maintenance"`);
    await queryRunner.query(`DROP TABLE "customer"`);
    await queryRunner.query(`DROP TABLE "salary"`);
    await queryRunner.query(`DROP TABLE "attendance"`);
    await queryRunner.query(`DROP TYPE "public"."attendance_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."attendance_shift_enum"`);
    await queryRunner.query(`DROP TABLE "account"`);
    await queryRunner.query(`DROP TYPE "public"."account_role_enum"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
