<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251029130301 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE articles (id INT AUTO_INCREMENT NOT NULL, auteur_id INT NOT NULL, theme_id INT NOT NULL, categorie_id INT DEFAULT NULL, image_principale_id INT DEFAULT NULL, titre VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, resume VARCHAR(255) DEFAULT NULL, INDEX IDX_BFDD316860BB6FE6 (auteur_id), INDEX IDX_BFDD316859027487 (theme_id), INDEX IDX_BFDD3168BCF5E72D (categorie_id), INDEX IDX_BFDD316891F8D062 (image_principale_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE blocs (id INT AUTO_INCREMENT NOT NULL, article_id INT DEFAULT NULL, type VARCHAR(20) NOT NULL, ordre INT NOT NULL, INDEX IDX_90770F747294869C (article_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE graphique (id INT AUTO_INCREMENT NOT NULL, metadonnées_id INT NOT NULL, blocs_id INT NOT NULL, titre VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, INDEX IDX_C352BAB84BB89F9C (metadonnées_id), INDEX IDX_C352BAB87C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, blocs_id INT NOT NULL, url VARCHAR(255) NOT NULL, alt VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, INDEX IDX_C53D045F7C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE texte (id INT AUTO_INCREMENT NOT NULL, blocs_id INT NOT NULL, titre VARCHAR(255) NOT NULL, INDEX IDX_EAE1A6EE7C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE titre (id INT AUTO_INCREMENT NOT NULL, blocs_id INT NOT NULL, titre VARCHAR(255) NOT NULL, niveau INT NOT NULL, INDEX IDX_FF7747B47C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316860BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316859027487 FOREIGN KEY (theme_id) REFERENCES theme (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD3168BCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316891F8D062 FOREIGN KEY (image_principale_id) REFERENCES image (id)');
        $this->addSql('ALTER TABLE blocs ADD CONSTRAINT FK_90770F747294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT FK_C352BAB84BB89F9C FOREIGN KEY (metadonnées_id) REFERENCES metadonnees (id)');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT FK_C352BAB87C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F7C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE texte ADD CONSTRAINT FK_EAE1A6EE7C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE titre ADD CONSTRAINT FK_FF7747B47C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316860BB6FE6');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316859027487');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD3168BCF5E72D');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316891F8D062');
        $this->addSql('ALTER TABLE blocs DROP FOREIGN KEY FK_90770F747294869C');
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY FK_C352BAB84BB89F9C');
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY FK_C352BAB87C40FD7C');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F7C40FD7C');
        $this->addSql('ALTER TABLE texte DROP FOREIGN KEY FK_EAE1A6EE7C40FD7C');
        $this->addSql('ALTER TABLE titre DROP FOREIGN KEY FK_FF7747B47C40FD7C');
        $this->addSql('DROP TABLE articles');
        $this->addSql('DROP TABLE blocs');
        $this->addSql('DROP TABLE graphique');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE texte');
        $this->addSql('DROP TABLE titre');
    }
}
