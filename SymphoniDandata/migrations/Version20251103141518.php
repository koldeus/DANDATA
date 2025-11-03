<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251103141518 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE article_note (id INT AUTO_INCREMENT NOT NULL, note DOUBLE PRECISION NOT NULL, article_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_7FFF7D157294869C (article_id), INDEX IDX_7FFF7D15A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE articles (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, resume VARCHAR(255) DEFAULT NULL, auteur_id INT NOT NULL, theme_id INT NOT NULL, image_principale_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_BFDD3168989D9B62 (slug), INDEX IDX_BFDD316860BB6FE6 (auteur_id), INDEX IDX_BFDD316859027487 (theme_id), INDEX IDX_BFDD316891F8D062 (image_principale_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE articles_categories (articles_id INT NOT NULL, categorie_id INT NOT NULL, INDEX IDX_DE004A0E1EBAF6CC (articles_id), INDEX IDX_DE004A0EBCF5E72D (categorie_id), PRIMARY KEY(articles_id, categorie_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE blocs (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(20) NOT NULL, ordre INT NOT NULL, article_id INT DEFAULT NULL, INDEX IDX_90770F747294869C (article_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE categorie (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE graphique (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, metadonnees_id INT NOT NULL, blocs_id INT NOT NULL, INDEX IDX_C352BAB8E3090641 (metadonnees_id), INDEX IDX_C352BAB87C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE image (id INT AUTO_INCREMENT NOT NULL, file_name VARCHAR(255) DEFAULT NULL, alt VARCHAR(255) NOT NULL, slug VARCHAR(255) NOT NULL, updated_at DATETIME DEFAULT NULL, blocs_id INT NOT NULL, INDEX IDX_C53D045F7C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE metadonnees (id INT AUTO_INCREMENT NOT NULL, url VARCHAR(255) NOT NULL, api_fichier TINYINT(1) NOT NULL, extension_retour VARCHAR(50) NOT NULL, file_name VARCHAR(255) DEFAULT NULL, updated_at DATETIME DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE site (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, theme_id INT NOT NULL, admin_id INT DEFAULT NULL, INDEX IDX_694309E459027487 (theme_id), INDEX IDX_694309E4642B8210 (admin_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE texte (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, blocs_id INT NOT NULL, INDEX IDX_EAE1A6EE7C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE theme (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(50) NOT NULL, slug VARCHAR(255) NOT NULL, link VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE titre (id INT AUTO_INCREMENT NOT NULL, titre VARCHAR(255) NOT NULL, niveau INT NOT NULL, blocs_id INT NOT NULL, INDEX IDX_FF7747B47C40FD7C (blocs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, pseudo VARCHAR(50) NOT NULL, UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('CREATE TABLE variable (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(255) NOT NULL, num_string TINYINT(1) NOT NULL, meta_id INT NOT NULL, INDEX IDX_CC4D878D39FCA6F9 (meta_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE article_note ADD CONSTRAINT FK_7FFF7D157294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE article_note ADD CONSTRAINT FK_7FFF7D15A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316860BB6FE6 FOREIGN KEY (auteur_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316859027487 FOREIGN KEY (theme_id) REFERENCES theme (id)');
        $this->addSql('ALTER TABLE articles ADD CONSTRAINT FK_BFDD316891F8D062 FOREIGN KEY (image_principale_id) REFERENCES image (id)');
        $this->addSql('ALTER TABLE articles_categories ADD CONSTRAINT FK_DE004A0E1EBAF6CC FOREIGN KEY (articles_id) REFERENCES articles (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE articles_categories ADD CONSTRAINT FK_DE004A0EBCF5E72D FOREIGN KEY (categorie_id) REFERENCES categorie (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE blocs ADD CONSTRAINT FK_90770F747294869C FOREIGN KEY (article_id) REFERENCES articles (id)');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT FK_C352BAB8E3090641 FOREIGN KEY (metadonnees_id) REFERENCES metadonnees (id)');
        $this->addSql('ALTER TABLE graphique ADD CONSTRAINT FK_C352BAB87C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE image ADD CONSTRAINT FK_C53D045F7C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E459027487 FOREIGN KEY (theme_id) REFERENCES theme (id)');
        $this->addSql('ALTER TABLE site ADD CONSTRAINT FK_694309E4642B8210 FOREIGN KEY (admin_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE texte ADD CONSTRAINT FK_EAE1A6EE7C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE titre ADD CONSTRAINT FK_FF7747B47C40FD7C FOREIGN KEY (blocs_id) REFERENCES blocs (id)');
        $this->addSql('ALTER TABLE variable ADD CONSTRAINT FK_CC4D878D39FCA6F9 FOREIGN KEY (meta_id) REFERENCES metadonnees (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article_note DROP FOREIGN KEY FK_7FFF7D157294869C');
        $this->addSql('ALTER TABLE article_note DROP FOREIGN KEY FK_7FFF7D15A76ED395');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316860BB6FE6');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316859027487');
        $this->addSql('ALTER TABLE articles DROP FOREIGN KEY FK_BFDD316891F8D062');
        $this->addSql('ALTER TABLE articles_categories DROP FOREIGN KEY FK_DE004A0E1EBAF6CC');
        $this->addSql('ALTER TABLE articles_categories DROP FOREIGN KEY FK_DE004A0EBCF5E72D');
        $this->addSql('ALTER TABLE blocs DROP FOREIGN KEY FK_90770F747294869C');
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY FK_C352BAB8E3090641');
        $this->addSql('ALTER TABLE graphique DROP FOREIGN KEY FK_C352BAB87C40FD7C');
        $this->addSql('ALTER TABLE image DROP FOREIGN KEY FK_C53D045F7C40FD7C');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E459027487');
        $this->addSql('ALTER TABLE site DROP FOREIGN KEY FK_694309E4642B8210');
        $this->addSql('ALTER TABLE texte DROP FOREIGN KEY FK_EAE1A6EE7C40FD7C');
        $this->addSql('ALTER TABLE titre DROP FOREIGN KEY FK_FF7747B47C40FD7C');
        $this->addSql('ALTER TABLE variable DROP FOREIGN KEY FK_CC4D878D39FCA6F9');
        $this->addSql('DROP TABLE article_note');
        $this->addSql('DROP TABLE articles');
        $this->addSql('DROP TABLE articles_categories');
        $this->addSql('DROP TABLE blocs');
        $this->addSql('DROP TABLE categorie');
        $this->addSql('DROP TABLE graphique');
        $this->addSql('DROP TABLE image');
        $this->addSql('DROP TABLE metadonnees');
        $this->addSql('DROP TABLE site');
        $this->addSql('DROP TABLE texte');
        $this->addSql('DROP TABLE theme');
        $this->addSql('DROP TABLE titre');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE variable');
    }
}
