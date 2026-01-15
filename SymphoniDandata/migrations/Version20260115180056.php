<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260115180056 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique CHANGE nb_ligne nb_ligne INT DEFAULT NULL');
        $this->addSql('ALTER TABLE metadonnees CHANGE nb_lignes_total nb_lignes_total INT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique CHANGE nb_ligne nb_ligne INT NOT NULL');
        $this->addSql('ALTER TABLE metadonnees CHANGE nb_lignes_total nb_lignes_total INT NOT NULL');
    }
}
