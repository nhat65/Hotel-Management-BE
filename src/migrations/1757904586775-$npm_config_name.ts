import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1757904586775 implements MigrationInterface {
  name = ' $npmConfigName1757904586775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" ADD "deleted_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "deleted_at"`);
  }
}
