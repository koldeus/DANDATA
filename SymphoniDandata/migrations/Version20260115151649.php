<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260115151649 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE metadonnees DROP FOREIGN KEY `FK_923DBDD1A038842D`');
        $this->addSql('ALTER TABLE metadonnees ADD CONSTRAINT FK_923DBDD1A038842D FOREIGN KEY (variable_identification_id) REFERENCES variable (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE metadonnees DROP FOREIGN KEY FK_923DBDD1A038842D');
        $this->addSql('ALTER TABLE metadonnees ADD CONSTRAINT `FK_923DBDD1A038842D` FOREIGN KEY (variable_identification_id) REFERENCES variable (id)');
    }
}
