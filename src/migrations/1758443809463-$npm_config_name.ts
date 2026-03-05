import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1758443809463 implements MigrationInterface {
  name = ' $npmConfigName1758443809463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" DROP CONSTRAINT "FK_a704b7c43c8e85919f41f66cd61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_equipment" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "FK_a704b7c43c8e85919f41f66cd61" FOREIGN KEY ("hotel_equipment_id") REFERENCES "room_equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" DROP CONSTRAINT "FK_a704b7c43c8e85919f41f66cd61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_equipment" ALTER COLUMN "id" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ADD CONSTRAINT "FK_a704b7c43c8e85919f41f66cd61" FOREIGN KEY ("hotel_equipment_id") REFERENCES "room_equipment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "equipment_maintenance" ALTER COLUMN "id" DROP DEFAULT`,
    );
  }
}
