<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260113183948 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique CHANGE titre titre VARCHAR(500) NOT NULL');
        $this->addSql('ALTER TABLE texte CHANGE texte texte VARCHAR(4096) NOT NULL');
        $this->addSql('ALTER TABLE titre CHANGE titre titre VARCHAR(500) NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique CHANGE titre titre VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE texte CHANGE texte texte VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE titre CHANGE titre titre VARCHAR(255) NOT NULL');
    }
}
