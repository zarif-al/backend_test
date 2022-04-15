import {MigrationInterface, QueryRunner} from "typeorm";

export class FinalNewNew1650034624329 implements MigrationInterface {
    name = 'FinalNewNew1650034624329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`emailBodyTemplate\` \`emailBodyTemplate\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`emailBodyTemplate\` \`emailBodyTemplate\` varchar(255) NULL`);
    }

}
