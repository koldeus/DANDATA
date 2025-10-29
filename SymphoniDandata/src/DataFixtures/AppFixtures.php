<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Articles;
use App\Entity\ArticleNote;
use App\Entity\Theme;
use App\Entity\Categorie;
use App\Entity\Site;
use App\Entity\Blocs;
use App\Entity\Image;
use App\Entity\Graphique;
use App\Entity\Texte;
use App\Entity\Titre;
use App\Entity\Metadonnees;
use App\Entity\Variable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        // ---------- USERS ----------
        $users = [];

        // Un admin
        $admin = new User();
        $admin->setEmail('admin@example.com')
              ->setPseudo('AdminUser')
              ->setPassword('password') // à encoder si nécessaire
              ->setRoles([User::ROLE_ADMIN, User::ROLE_SUBSCRIBER]);
        $manager->persist($admin);
        $users[] = $admin;

        // 5 utilisateurs abonnés avec des rôles aléatoires
        $rolePool = [
            User::ROLE_AUTHOR,
            User::ROLE_EDITOR,
            User::ROLE_DESIGNER,
            User::ROLE_DATA_PROVIDER,
        ];

        for ($i = 1; $i <= 5; $i++) {
            $user = new User();
            $user->setEmail("user$i@example.com")
                 ->setPseudo("User$i")
                 ->setPassword('password')
                 ->setRoles(array_merge([User::ROLE_SUBSCRIBER], [$rolePool[array_rand($rolePool)]]));
            $manager->persist($user);
            $users[] = $user;
        }

        // ---------- THEMES ----------
        $theme = new Theme();
        $theme->setNom('Dark Theme')
              ->setSlug('dark-theme')
              ->setLink('/themes/dark');
        $manager->persist($theme);

        // ---------- CATEGORIES ----------
        $category = new Categorie();
        $category->setNom('Science');
        $manager->persist($category);

        // ---------- SITES ----------
        $site = new Site();
        $site->setNom('MonSite')
             ->setTheme($theme)
             ->setAdmin($admin);
        $manager->persist($site);

        // ---------- ARTICLES ----------
        $articles = [];
        for ($i = 1; $i <= 3; $i++) {
            $article = new Articles();
            $article->setTitre("Article $i")
                    ->setSlug("article-$i")
                    ->setResume("Résumé de l'article $i")
                    ->setAuteur($users[array_rand($users)])
                    ->setTheme($theme)
                    ->setCategorie($category);
            $manager->persist($article);
            $articles[] = $article;
        }

        // ---------- ARTICLE NOTES ----------
        foreach ($articles as $article) {
            foreach ($users as $user) {
                if (!in_array(User::ROLE_VISITOR, $user->getRoles())) { // abonnés
                    $note = new ArticleNote();
                    $note->setArticle($article)
                         ->setUser($user)
                         ->setNote(rand(0, 5));
                    $manager->persist($note);
                }
            }
        }

        // ---------- BLOCS ----------
        foreach ($articles as $article) {
            // Un bloc texte
            $blocTexte = new Blocs();
            $blocTexte->setType('texte')
                      ->setOrdre(1)
                      ->setArticle($article);
            $manager->persist($blocTexte);

            $texte = new Texte();
            $texte->setTitre("Texte de l'article {$article->getId()}")
                  ->setBlocs($blocTexte);
            $manager->persist($texte);

            // Un bloc image
            $blocImage = new Blocs();
            $blocImage->setType('image')
                      ->setOrdre(2)
                      ->setArticle($article);
            $manager->persist($blocImage);

            $image = new Image();
            $image->setUrl('https://via.placeholder.com/150')
                  ->setAlt('Image article')
                  ->setSlug('image-article-' . $article->getId())
                  ->setBlocs($blocImage);
            $manager->persist($image);

            // Un bloc graphique
            $blocGraphique = new Blocs();
            $blocGraphique->setType('graphique')
                          ->setOrdre(3)
                          ->setArticle($article);
            $manager->persist($blocGraphique);

            $meta = new Metadonnees();
            $meta->setUrl('https://api.example.com/data.csv')
                 ->setApiFichier(true)
                 ->setExtensionRetour('csv');
            $manager->persist($meta);

            $graphique = new Graphique();
            $graphique->setTitre('Graphique ' . $article->getId())
                      ->setType('bar')
                      ->setBlocs($blocGraphique)
                      ->setMetadonnees($meta);
            $manager->persist($graphique);

            // Variable pour le graphique
            $variable = new Variable();
            $variable->setNom('Variable 1')
                     ->setNumString(true)
                     ->setMeta($meta);
            $manager->persist($variable);

            // Un bloc titre
            $blocTitre = new Blocs();
            $blocTitre->setType('titre')
                      ->setOrdre(4)
                      ->setArticle($article);
            $manager->persist($blocTitre);

            $titre = new Titre();
            $titre->setTitre("Titre du bloc")
                  ->setNiveau(2)
                  ->setBlocs($blocTitre);
            $manager->persist($titre);
        }

        $manager->flush();
    }
}
