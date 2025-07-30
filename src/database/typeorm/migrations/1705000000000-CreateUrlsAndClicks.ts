import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUrlsAndClicks1705000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'urls',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'original_url',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'short_code',
            type: 'varchar',
            length: '6',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'user_id',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
        foreignKeys: [
          {
            name: 'fk_urls_user_id',
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'clicks',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'url_id',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'ip_address',
            type: 'varchar',
            length: '45',
            isNullable: false,
          },
          {
            name: 'user_agent',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'referer',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            name: 'fk_clicks_url_id',
            columnNames: ['url_id'],
            referencedTableName: 'urls',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    await queryRunner.query('CREATE INDEX idx_urls_short_code ON urls(short_code)');
    await queryRunner.query('CREATE INDEX idx_urls_user_id ON urls(user_id)');
    await queryRunner.query('CREATE INDEX idx_urls_deleted_at ON urls(deleted_at)');
    await queryRunner.query('CREATE INDEX idx_clicks_url_id ON clicks(url_id)');
    await queryRunner.query('CREATE INDEX idx_clicks_ip_address ON clicks(ip_address)');
    await queryRunner.query('CREATE INDEX idx_clicks_created_at ON clicks(created_at)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clicks');
    await queryRunner.dropTable('urls');
  }
} 