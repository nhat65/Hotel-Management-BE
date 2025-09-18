import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1758013055032 implements MigrationInterface {
  name = ' $npmConfigName1758013055032';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP COLUMN "total_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "room_amount" numeric(8,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "room_amount"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD "total_amount" numeric(8,2) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD "quantity" integer NOT NULL`,
    );
  }
}
