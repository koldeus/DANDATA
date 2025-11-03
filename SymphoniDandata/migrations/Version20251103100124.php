<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251103100124 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY `FK_C352BAB8389F3D06`');
        $this->addSql('DROP INDEX IDX_C352BAB8389F3D06 ON graphique');
        $this->addSql('ALTER TABLE graphique CHANGE metadonnees_id_id metadonnees_id INT NOT NULL');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT FK_C352BAB8E3090641 FOREIGN KEY (metadonnees_id) REFERENCES metadonnees (id)');
        $this->addSql('CREATE INDEX IDX_C352BAB8E3090641 ON graphique (metadonnees_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY FK_C352BAB8E3090641');
        $this->addSql('DROP INDEX IDX_C352BAB8E3090641 ON graphique');
        $this->addSql('ALTER TABLE graphique CHANGE metadonnees_id metadonnees_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT `FK_C352BAB8389F3D06` FOREIGN KEY (metadonnees_id_id) REFERENCES metadonnees (id)');
        $this->addSql('CREATE INDEX IDX_C352BAB8389F3D06 ON graphique (metadonnees_id_id)');
    }
}
