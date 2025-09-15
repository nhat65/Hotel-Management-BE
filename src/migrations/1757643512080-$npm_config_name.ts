import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1757643512080 implements MigrationInterface {
  name = ' $npmConfigName1757643512080';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "token" character varying(500) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_token" DROP COLUMN "token"`);
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD "token" character varying(255) NOT NULL`,
    );
  }
}
