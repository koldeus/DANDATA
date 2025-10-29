<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251029122308 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE metadonnees (id INT AUTO_INCREMENT NOT NULL, url VARCHAR(255) NOT NULL, api_fichier TINYINT(1) NOT NULL, extension_retour VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE variable (id INT AUTO_INCREMENT NOT NULL, meta_id INT NOT NULL, nom VARCHAR(255) NOT NULL, num_string TINYINT(1) NOT NULL, INDEX IDX_CC4D878D39FCA6F9 (meta_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE variable ADD CONSTRAINT FK_CC4D878D39FCA6F9 FOREIGN KEY (meta_id) REFERENCES metadonnees (id)');
        $this->addSql('ALTER TABLE site ADD admin_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E4642B8210 FOREIGN KEY (admin_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_694309E4642B8210 ON site (admin_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE variable DROP FOREIGN KEY FK_CC4D878D39FCA6F9');
        $this->addSql('DROP TABLE metadonnees');
        $this->addSql('DROP TABLE variable');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E4642B8210');
        $this->addSql('DROP INDEX IDX_694309E4642B8210 ON site');
        $this->addSql('ALTER TABLE site DROP admin_id');
    }
}
