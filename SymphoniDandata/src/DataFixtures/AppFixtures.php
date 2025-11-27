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

        $admin = new User();
        $admin->setEmail('admin@example.com')
            ->setPseudo('AdminUser')
            ->setPassword('password') 
            ->setRoles([User::ROLE_ADMIN, User::ROLE_SUBSCRIBER]);
        $manager->persist($admin);
        $users[] = $admin;

        $manager->flush();
    }
}
