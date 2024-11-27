import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLocationPrefixEntityAddPrefixIndex1732637194312
  implements MigrationInterface
{
  name = 'UpdateLocationPrefixEntityAddPrefixIndex1732637194312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_2837c5f9dd716df6d0e8934479" ON "location_prefix" ("prefix") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2837c5f9dd716df6d0e8934479"`,
    );
  }
}
