<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251029130947 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE user_articles (user_id INT NOT NULL, articles_id INT NOT NULL, INDEX IDX_5F50D568A76ED395 (user_id), INDEX IDX_5F50D5681EBAF6CC (articles_id), PRIMARY KEY(user_id, articles_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE user_articles ADD CONSTRAINT FK_5F50D568A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE user_articles ADD CONSTRAINT FK_5F50D5681EBAF6CC FOREIGN KEY (articles_id) REFERENCES articles (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE user_articles DROP FOREIGN KEY FK_5F50D568A76ED395');
        $this->addSql('ALTER TABLE user_articles DROP FOREIGN KEY FK_5F50D5681EBAF6CC');
        $this->addSql('DROP TABLE user_articles');
    }
}
