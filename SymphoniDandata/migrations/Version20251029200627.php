<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251029200627 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE messenger_messages');
        $this->addSql('ALTER TABLE articles CHANGE theme_id theme_id INT NOT NULL');
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY `FK_C352BAB84BB89F9C`');
        $this->addSql('DROP INDEX IDX_C352BAB84BB89F9C ON graphique');
        $this->addSql('ALTER TABLE graphique CHANGE metadonnées_id metadonnees_id_id INT NOT NULL');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT FK_C352BAB8389F3D06 FOREIGN KEY (metadonnees_id_id) REFERENCES metadonnees (id)');
        $this->addSql('CREATE INDEX IDX_C352BAB8389F3D06 ON graphique (metadonnees_id_id)');
        $this->addSql('ALTER TABLE metadonnees DROP nom_fichier, DROP date_import');
        $this->addSql('ALTER TABLE site CHANGE theme_id theme_id INT NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL');
        $this->addSql('DROP INDEX uniq_identifier_email ON user');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON user (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, headers LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, queue_name VARCHAR(190) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), INDEX IDX_75EA56E0FB7336F0 (queue_name), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE articles CHANGE theme_id theme_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY FK_C352BAB8389F3D06');
        $this->addSql('DROP INDEX IDX_C352BAB8389F3D06 ON graphique');
        $this->addSql('ALTER TABLE graphique CHANGE metadonnees_id_id metadonnées_id INT NOT NULL');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT `FK_C352BAB84BB89F9C` FOREIGN KEY (metadonnées_id) REFERENCES metadonnees (id)');
        $this->addSql('CREATE INDEX IDX_C352BAB84BB89F9C ON graphique (metadonnées_id)');
        $this->addSql('ALTER TABLE metadonnees ADD nom_fichier VARCHAR(255) DEFAULT NULL, ADD date_import DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE site CHANGE theme_id theme_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user CHANGE roles roles JSON NOT NULL COMMENT \'(DC2Type:json)\'');
        $this->addSql('DROP INDEX uniq_8d93d649e7927c74 ON user');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL ON user (email)');
    }
}
