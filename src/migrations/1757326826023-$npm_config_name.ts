import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1757326826023 implements MigrationInterface {
  name = ' $npmConfigName1757326826023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_id" uuid NOT NULL, "token" character varying(255) NOT NULL, "expires_at" TIMESTAMP NOT NULL, "ip_address" character varying, "user_agent" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "isRevoked" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_f8e6c51db7655e2f7084f615681" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_f8e6c51db7655e2f7084f615681"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_token"`);
  }
}
