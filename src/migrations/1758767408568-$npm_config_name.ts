import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1758767408568 implements MigrationInterface {
  name = ' $npmConfigName1758767408568';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount_paid"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "amount_paid" numeric(8,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payment" DROP COLUMN "amount_paid"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD "amount_paid" bigint NOT NULL`,
    );
  }
}
