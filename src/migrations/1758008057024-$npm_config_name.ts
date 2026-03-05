import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1758008057024 implements MigrationInterface {
  name = ' $npmConfigName1758008057024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_57f3269d238d3af5420e6e4fe89"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP CONSTRAINT "FK_0e8d3e0aed74638ca7f0a06caba"`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_rooms" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "booking_detail_id" uuid NOT NULL, "room_id" uuid NOT NULL, "quantity" integer NOT NULL, "total_amount" numeric(8,2) NOT NULL, CONSTRAINT "PK_712966000837d1e06c04ba357be" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "booking_services" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "booking_detail_id" uuid NOT NULL, "service_id" uuid NOT NULL, "quantity" integer NOT NULL, "total_amount" numeric(8,2) NOT NULL, CONSTRAINT "PK_8997bf4d0728c8740c87694d59a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "subtotal"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "deleted_at"`);
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "room_quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "service_quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "room_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "service_price"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "room_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "service_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "sub_total" numeric(8,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "actual_check_in" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "actual_check_out" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "total_amount" numeric(8,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "time"`);
    await queryRunner.query(`ALTER TABLE "invoice" ADD "time" date NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "expected_check_in"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "expected_check_in" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "expected_check_out"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "expected_check_out" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD CONSTRAINT "FK_444fd4609240381577641e15942" FOREIGN KEY ("booking_detail_id") REFERENCES "booking_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD CONSTRAINT "FK_cb71638bb7c1eeccc6753551bc6" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" ADD CONSTRAINT "FK_ba686b6f63dc2860bf3b7ec3f73" FOREIGN KEY ("booking_detail_id") REFERENCES "booking_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" ADD CONSTRAINT "FK_6e853453a3c24df1beed35c13eb" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_services" DROP CONSTRAINT "FK_6e853453a3c24df1beed35c13eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" DROP CONSTRAINT "FK_ba686b6f63dc2860bf3b7ec3f73"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP CONSTRAINT "FK_cb71638bb7c1eeccc6753551bc6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP CONSTRAINT "FK_444fd4609240381577641e15942"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "expected_check_out"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "expected_check_out" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP COLUMN "expected_check_in"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "expected_check_in" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "time"`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "time" TIMESTAMP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "total_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "actual_check_out"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "actual_check_in"`,
    );
    await queryRunner.query(`ALTER TABLE "invoice" DROP COLUMN "sub_total"`);
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "service_id" uuid`,
    );
    await queryRunner.query(`ALTER TABLE "booking_details" ADD "room_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "service_price" numeric(8,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "room_price" numeric(8,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "service_quantity" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "room_quantity" integer`,
    );
    await queryRunner.query(`ALTER TABLE "staff" ADD "deleted_at" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "invoice" ADD "subtotal" numeric(8,2) NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "booking_services"`);
    await queryRunner.query(`DROP TABLE "booking_rooms"`);
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_0e8d3e0aed74638ca7f0a06caba" FOREIGN KEY ("service_id") REFERENCES "service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD CONSTRAINT "FK_57f3269d238d3af5420e6e4fe89" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
