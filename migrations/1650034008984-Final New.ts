import {MigrationInterface, QueryRunner} from "typeorm";

export class FinalNew1650034008984 implements MigrationInterface {
    name = 'FinalNew1650034008984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`emailBodyTemplate\` \`emailBodyTemplate\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer\` CHANGE \`emailBodyTemplate\` \`emailBodyTemplate\` varchar(255) NOT NULL`);
    }

}
