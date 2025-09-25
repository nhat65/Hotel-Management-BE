import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1758766732116 implements MigrationInterface {
  name = ' $npmConfigName1758766732116';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_20cc84d8a2274ae86f551360c11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "invoice_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."room_equipment_status_enum" RENAME TO "room_equipment_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."room_equipment_status_enum" AS ENUM('all', 'available', 'in_use', 'broken', 'maintenance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_equipment" ALTER COLUMN "status" TYPE "public"."room_equipment_status_enum" USING "status"::"text"::"public"."room_equipment_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."room_equipment_status_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."room_status_enum" RENAME TO "room_status_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."room_status_enum" AS ENUM('all', 'available', 'occupied', 'maintenance', 'cleaning')`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ALTER COLUMN "status" TYPE "public"."room_status_enum" USING "status"::"text"::"public"."room_status_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."room_status_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_20cc84d8a2274ae86f551360c11" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "payment" DROP CONSTRAINT "FK_20cc84d8a2274ae86f551360c11"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."room_status_enum_old" AS ENUM('available', 'occupied', 'maintenance', 'cleaning')`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ALTER COLUMN "status" TYPE "public"."room_status_enum_old" USING "status"::"text"::"public"."room_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."room_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."room_status_enum_old" RENAME TO "room_status_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."room_equipment_status_enum_old" AS ENUM('available', 'in_use', 'broken', 'maintenance')`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_equipment" ALTER COLUMN "status" TYPE "public"."room_equipment_status_enum_old" USING "status"::"text"::"public"."room_equipment_status_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."room_equipment_status_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."room_equipment_status_enum_old" RENAME TO "room_equipment_status_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ALTER COLUMN "invoice_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "payment" ADD CONSTRAINT "FK_20cc84d8a2274ae86f551360c11" FOREIGN KEY ("invoice_id") REFERENCES "invoice"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
