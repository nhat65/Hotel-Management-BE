import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1758018729309 implements MigrationInterface {
  name = ' $npmConfigName1758018729309';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "room_quantity" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ALTER COLUMN "actual_check_in" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ALTER COLUMN "actual_check_out" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_details" ALTER COLUMN "actual_check_out" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ALTER COLUMN "actual_check_in" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "room_quantity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "quantity" integer NOT NULL`,
    );
  }
}
