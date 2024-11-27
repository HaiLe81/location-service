import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLocationEntities1732637050182 implements MigrationInterface {
  name = 'CreateLocationEntities1732637050182';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_by" character varying, "deleted_at" TIMESTAMP, "name" character varying(255) NOT NULL, "code" character varying(10) NOT NULL, "area" double precision, "parent_id" uuid, CONSTRAINT "UQ_393d28b765a9b5443084d37c471" UNIQUE ("parent_id", "code"), CONSTRAINT "CHK_d4997d74c977648418e7394d88" CHECK ("code" NOT LIKE '%-%'), CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location_prefix" ("created_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_by" character varying, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_by" character varying, "deleted_at" TIMESTAMP, "id" uuid NOT NULL, "prefix" character varying NOT NULL, CONSTRAINT "PK_aaec3b0cc263af1031a5dc403c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_92137b1457c0969fe2d20a9faff" FOREIGN KEY ("parent_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location_prefix" ADD CONSTRAINT "FK_aaec3b0cc263af1031a5dc403c8" FOREIGN KEY ("id") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "location_prefix" DROP CONSTRAINT "FK_aaec3b0cc263af1031a5dc403c8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_92137b1457c0969fe2d20a9faff"`,
    );
    await queryRunner.query(`DROP TABLE "location_prefix"`);
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
