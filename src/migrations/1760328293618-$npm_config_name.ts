import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1760328293618 implements MigrationInterface {
  name = ' $npmConfigName1760328293618';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_details" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_services" DROP COLUMN "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP COLUMN "updated_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking_rooms" DROP COLUMN "created_at"`,
    );
  }
}
