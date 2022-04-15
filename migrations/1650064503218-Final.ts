import {MigrationInterface, QueryRunner} from "typeorm";

export class Final1650064503218 implements MigrationInterface {
    name = 'Final1650064503218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`customer\` (\`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`enabled\` tinyint NOT NULL, \`emailScheduleTime\` datetime NOT NULL, \`emailBodyTemplate\` varchar(255) NOT NULL, PRIMARY KEY (\`email\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`customer\``);
    }

}
