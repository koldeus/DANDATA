<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260109100136 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE graphique_variable (graphique_id INT NOT NULL, variable_id INT NOT NULL, INDEX IDX_7531FE8336431CB1 (graphique_id), INDEX IDX_7531FE83F3037E8E (variable_id), PRIMARY KEY (graphique_id, variable_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE graphique_variable ADD CONSTRAINT FK_7531FE8336431CB1 FOREIGN KEY (graphique_id) REFERENCES graphique (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE graphique_variable ADD CONSTRAINT FK_7531FE83F3037E8E FOREIGN KEY (variable_id) REFERENCES variable (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique_variable DROP FOREIGN KEY FK_7531FE8336431CB1');
        $this->addSql('ALTER TABLE graphique_variable DROP FOREIGN KEY FK_7531FE83F3037E8E');
        $this->addSql('DROP TABLE graphique_variable');
    }
}
