<?php

namespace App\DataFixtures;

use App\Entity\Articles;
use App\Entity\ArticleNote;
use App\Entity\Blocs;
use App\Entity\Categorie;
use App\Entity\Graphique;
use App\Entity\Image;
use App\Entity\Metadonnees;
use App\Entity\Site;
use App\Entity\Texte;
use App\Entity\Theme;
use App\Entity\Titre;
use App\Entity\User;
use App\Entity\Variable;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        $themes = [];
        $themesData = [
            ['nom' => 'Thème Claire', 'slug' => 'LightTheme'],
            ['nom' => 'Thème Nuit', 'slug' => 'NightTheme'],
            ['nom' => 'Thème Sombre', 'slug' => 'DarkTheme'],
            ['nom' => 'Crème Blanc', 'slug' => 'CreamTheme'],
        ];

        foreach ($themesData as $data) {
            $theme = new Theme();
            $theme->setNom($data['nom']);
            $theme->setSlug($data['slug']);
            $manager->persist($theme);
            $themes[] = $theme;
        }

        $users = [];

        $admin = new User();
        $admin->setEmail('admin@dandata.com');
        $admin->setPseudo('AdminDanData');
        $admin->setRoles(['ROLE_ADMIN', 'ROLE_SUBSCRIBER']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'Admin123!'));
        $manager->persist($admin);
        $users['admin'] = $admin;

        $author = new User();
        $author->setEmail('auteur@dandata.com');
        $author->setPseudo('JeanAuteur');
        $author->setRoles(['ROLE_SUBSCRIBER', 'ROLE_AUTHOR']);
        $author->setPassword($this->passwordHasher->hashPassword($author, 'Author123!'));
        $manager->persist($author);
        $users['author'] = $author;

        $editor = new User();
        $editor->setEmail('editeur@dandata.com');
        $editor->setPseudo('MarieEditrice');
        $editor->setRoles(['ROLE_SUBSCRIBER', 'ROLE_EDITOR', 'ROLE_DESIGNER']);
        $editor->setPassword($this->passwordHasher->hashPassword($editor, 'Editor123!'));
        $manager->persist($editor);
        $users['editor'] = $editor;

        $dataProvider = new User();
        $dataProvider->setEmail('data@dandata.com');
        $dataProvider->setPseudo('DataMaster');
        $dataProvider->setRoles(['ROLE_SUBSCRIBER', 'ROLE_DATA_PROVIDER']);
        $dataProvider->setPassword($this->passwordHasher->hashPassword($dataProvider, 'Data123!'));
        $manager->persist($dataProvider);
        $users['data'] = $dataProvider;

        for ($i = 1; $i <= 5; $i++) {
            $subscriber = new User();
            $subscriber->setEmail("user{$i}@dandata.com");
            $subscriber->setPseudo("Lecteur{$i}");
            $subscriber->setRoles(['ROLE_SUBSCRIBER']);
            $subscriber->setPassword($this->passwordHasher->hashPassword($subscriber, "User{$i}23!"));
            $manager->persist($subscriber);
            $users["subscriber{$i}"] = $subscriber;
        }

        $site = new Site();
        $site->setNom('DanData');
        $site->setTheme($themes[1]); 
        $site->setAdmin($admin);
        $manager->persist($site);

        $categories = [];
        $categoriesData = [
            'Gaming',
            'Technologie',
            'Analyse de données',
            'Statistiques',
            'eSports',
            'Streaming',
            'Classements',
            'Tendances'
        ];

        foreach ($categoriesData as $catName) {
            $categorie = new Categorie();
            $categorie->setNom($catName);
            $manager->persist($categorie);
            $categories[] = $categorie;
        }

        $images = [];
        $imagesData = [
            ['alt' => 'Steam Platform Gaming', 'slug' => 'steam-platform-gaming', 'fileName' => 'steam-platform-gaming.jpg'],
            ['alt' => 'Counter-Strike 2 Gameplay', 'slug' => 'cs2-gameplay', 'fileName' => 'cs2-gameplay.jpg'],
            ['alt' => 'Dota 2 Battle', 'slug' => 'dota2-battle', 'fileName' => 'dota2-battle.jpg'],
            ['alt' => 'Gaming Statistics', 'slug' => 'gaming-stats', 'fileName' => 'gaming-stats.jpg'],
            ['alt' => 'eSports Arena', 'slug' => 'esports-arena', 'fileName' => 'esports-arena.jpg'],
            ['alt' => 'Data Visualization', 'slug' => 'data-viz', 'fileName' => 'data-viz.jpg'],
            ['alt' => 'Gaming Trends', 'slug' => 'gaming-trends', 'fileName' => 'gaming-trends.jpg'],
            ['alt' => 'Player Statistics', 'slug' => 'player-stats', 'fileName' => 'player-stats.jpg'],
        ];

        foreach ($imagesData as $imgData) {
            $image = new Image();
            $image->setAlt($imgData['alt']);
            $image->setSlug($imgData['slug']);
            $image->setFileName($imgData['fileName']);
            $image->setUpdatedAt(new \DateTimeImmutable());
            $manager->persist($image);
            $images[] = $image;
        }

        $metadonnees = [];

        $meta1 = new Metadonnees();
        $meta1->setUrl('/uploads/metadonnees/beffe4704d696061.csv');
        $meta1->setNom('steam_top100_current_20260112_1706.csv');
        $meta1->setApiFichier(false);
        $meta1->setExtensionRetour('csv');
        $meta1->setFileName('beffe4704d696061.csv');
        $meta1->setNbLignesTotal(100);
        $meta1->setUpdatedAt(new \DateTimeImmutable('2026-01-15 19:14:47'));
        $manager->persist($meta1);
        $metadonnees[] = $meta1;

        $meta2 = new Metadonnees();
        $meta2->setUrl('/uploads/metadonnees/45fbb047e6aeb017.csv');
        $meta2->setNom('Donnees_de_jeu_d-un_joueur.csv');
        $meta2->setApiFichier(false);
        $meta2->setExtensionRetour(extension_retour: 'csv');
        $meta2->setFileName('45fbb047e6aeb017.csv');
        $meta2->setNbLignesTotal(10);
        $meta2->setUpdatedAt(new \DateTimeImmutable('2026-01-16 19:15:01'));
        $manager->persist($meta2);
        $metadonnees[] = $meta2;

        $variables1 = [];
        $variablesData1 = [
            ['nom' => 'Rank', 'num_string' => true, 'color' => '#FF6B6B'],
            ['nom' => 'Game Name', 'num_string' => false, 'color' => '#4ECDC4'],
            ['nom' => 'AppID', 'num_string' => true, 'color' => '#45B7D1'],
            ['nom' => 'Current Players', 'num_string' => true, 'color' => '#FFA07A'],
            ['nom' => '24h Peak (estimated)', 'num_string' => true, 'color' => '#98D8C8'],
            ['nom' => 'All-Time Peak (estimated)', 'num_string' => true, 'color' => '#F7DC6F'],
            ['nom' => 'Average Players (2 weeks)', 'num_string' => true, 'color' => '#BB8FCE'],
        ];

        foreach ($variablesData1 as $varData) {
            $variable = new Variable();
            $variable->setNom($varData['nom']);
            $variable->setNumString($varData['num_string']);
            $variable->setColor($varData['color']);
            $variable->setMeta($meta1);
            $manager->persist($variable);
            $variables1[] = $variable;
        }
        $meta1->setVariableIdentification($variables1[1]); 
        $variables2 = [];
        $variablesData2 = [
            ['nom' => 'Genre', 'num_string' => true, 'color' => '#FF6B6B'],
            ['nom' => 'Number of Games', 'num_string' => true, 'color' => '#4ECDC4'],
        ];

        foreach ($variablesData2 as $varData) {
            $variable = new Variable();
            $variable->setNom($varData['nom']);
            $variable->setNumString($varData['num_string']);
            $variable->setColor($varData['color']);
            $variable->setMeta($meta2);
            $manager->persist($variable);
            $variables2[] = $variable;
        }

        $meta2->setVariableIdentification($variables2[0]); 

        $articles = [];

        $article1 = new Articles();
        $article1->setTitre('Steam Explose les Records : Dota 2 et Counter-Strike 2 en Tête');
        $article1->setSlug('steam-explose-les-records-dota-2-et-counter-strike-2-en-tete');
        $article1->setResume('Steam continue de battre des records de fréquentation avec plus de 42 millions d\'utilisateurs simultanés en janvier 2026.');
        $article1->setAuteur($admin);
        $article1->setTheme($themes[3]); 
        $article1->setImagePrincipale($images[0]);
        $article1->addCategorie($categories[0]);
        $article1->addCategorie($categories[6]); 
        $article1->setCreatedAt(new \DateTimeImmutable('2026-01-16 14:12:53'));
        $manager->persist($article1);
        $articles[] = $article1;

        $ordre = 1;

        $bloc1_1 = new Blocs();
        $bloc1_1->setType('graphique');
        $bloc1_1->setOrdre($ordre++);
        $bloc1_1->setArticle($article1);
        $manager->persist($bloc1_1);

        $graphique1 = new Graphique();
        $graphique1->setTitre('La plateforme Steam atteint des sommets historiques');
        $graphique1->setType('bar');
        $graphique1->setNbLigne(10);
        $graphique1->setMetadonnees($meta1);
        $graphique1->setBlocs($bloc1_1);
        $graphique1->addVariable($variables1[3]);
        $graphique1->addVariable($variables1[4]);
        $manager->persist($graphique1);

        $bloc1_2 = new Blocs();
        $bloc1_2->setType('titre');
        $bloc1_2->setOrdre($ordre++);
        $bloc1_2->setArticle($article1);
        $manager->persist($bloc1_2);

        $titre1_1 = new Titre();
        $titre1_1->setTitre('Counter-Strike 2 : L\'Ascension Fulgurante');
        $titre1_1->setNiveau(2);
        $titre1_1->setBlocs($bloc1_2);
        $manager->persist($titre1_1);

        $bloc1_3 = new Blocs();
        $bloc1_3->setType('texte');
        $bloc1_3->setOrdre($ordre++);
        $bloc1_3->setArticle($article1);
        $manager->persist($bloc1_3);

        $texte1_1 = new Texte();
        $texte1_1->setTexte('<p>Counter-Strike 2 écrase tous les records depuis son lancement en septembre 2023. Le jeu a atteint 1 862 531 joueurs simultanés, établissant un nouveau jalon historique pour la franchise. Cette performance dépasse même le record légendaire de CS:GO qui culminait à 1,8 million de joueurs en mai 2023.</p>
<p>La croissance du titre de <a href="https://fr.wikipedia.org/wiki/Valve_Corporation" target="_blank" rel="noopener noreferrer">Valve</a> est remarquable : en février 2025, CS2 affichait déjà 1 744 015 joueurs simultanés. Le succès s\'explique par le mode Premier amélioré, les mises à jour régulières de skins et une scène esports florissante.</p>');
        $texte1_1->setBlocs($bloc1_3);
        $manager->persist($texte1_1);

        $bloc1_4 = new Blocs();
        $bloc1_4->setType('image');
        $bloc1_4->setOrdre($ordre++);
        $bloc1_4->setArticle($article1);
        $bloc1_4->addImage($images[1]);
        $manager->persist($bloc1_4);

        $bloc1_5 = new Blocs();
        $bloc1_5->setType('titre');
        $bloc1_5->setOrdre($ordre++);
        $bloc1_5->setArticle($article1);
        $manager->persist($bloc1_5);

        $titre1_2 = new Titre();
        $titre1_2->setTitre('Dota 2 : Le Vétéran Indétrônable');
        $titre1_2->setNiveau(2);
        $titre1_2->setBlocs($bloc1_5);
        $manager->persist($titre1_2);

        $bloc1_6 = new Blocs();
        $bloc1_6->setType('texte');
        $bloc1_6->setOrdre($ordre++);
        $bloc1_6->setArticle($article1);
        $manager->persist($bloc1_6);

        $texte1_2 = new Texte();
        $texte1_2->setTexte('<p>Si Counter-Strike 2 vole la vedette, Dota 2 reste un pilier inébranlable de Steam. Le MOBA maintient une moyenne constante de plus de 600 000 joueurs simultanés, avec des pics dépassant les 700 000.</p>
<p>L\'endurance de Dota 2 est exceptionnelle. Après plus d\'une décennie d\'existence, le jeu continue d\'attirer des millions de fans grâce à son gameplay complexe et sa scène compétitive légendaire avec The International. Ensemble, CS2 et Dota 2 incarnent la formule gagnante de Valve.</p>');
        $texte1_2->setBlocs($bloc1_6);
        $manager->persist($texte1_2);

        $bloc1_7 = new Blocs();
        $bloc1_7->setType('image');
        $bloc1_7->setOrdre($ordre++);
        $bloc1_7->setArticle($article1);
        $bloc1_7->addImage($images[2]);
        $manager->persist($bloc1_7);


        $article2 = new Articles();
        $article2->setTitre('Les Tendances Gaming 2026 : Ce Qui Fait Vibrer Les Joueurs');
        $article2->setSlug('les-tendances-gaming-2026-ce-qui-fait-vibrer-les-joueurs');
        $article2->setResume('Découvrez les principales tendances qui définissent l\'industrie du jeu vidéo en 2026.');
        $article2->setAuteur($author);
        $article2->setTheme($themes[0]);
        $article2->setImagePrincipale($images[6]);
        $article2->addCategorie($categories[0]);
        $article2->addCategorie($categories[7]);
        $article2->setCreatedAt(new \DateTimeImmutable('2026-01-18 10:30:00'));
        $manager->persist($article2);
        $articles[] = $article2;

        $bloc2_1 = new Blocs();
        $bloc2_1->setType('titre');
        $bloc2_1->setOrdre(1);
        $bloc2_1->setArticle($article2);
        $manager->persist($bloc2_1);

        $titre2_1 = new Titre();
        $titre2_1->setTitre('L\'Essor du Cloud Gaming');
        $titre2_1->setNiveau(2);
        $titre2_1->setBlocs($bloc2_1);
        $manager->persist($titre2_1);

        $bloc2_2 = new Blocs();
        $bloc2_2->setType('texte');
        $bloc2_2->setOrdre(2);
        $bloc2_2->setArticle($article2);
        $manager->persist($bloc2_2);

        $texte2_1 = new Texte();
        $texte2_1->setTexte('<p>Le cloud gaming connaît une croissance explosive en 2026. Les plateformes comme GeForce Now, Xbox Cloud Gaming et PlayStation Plus Premium permettent aux joueurs d\'accéder à des jeux AAA sans console haut de gamme.</p>
<p>Cette démocratisation transforme l\'industrie en rendant les jeux accessibles à un public plus large. Les joueurs peuvent désormais profiter de titres exigeants sur smartphones, tablettes ou ordinateurs modestes.</p>');
        $texte2_1->setBlocs($bloc2_2);
        $manager->persist($texte2_1);

        $article3 = new Articles();
        $article3->setTitre('L\'Économie de l\'eSport : Chiffres et Perspectives 2026');
        $article3->setSlug('economie-esport-chiffres-perspectives-2026');
        $article3->setResume('Une analyse approfondie de l\'économie florissante de l\'esport et ses perspectives de croissance.');
        $article3->setAuteur($editor);
        $article3->setTheme($themes[2]);
        $article3->setImagePrincipale($images[4]);
        $article3->addCategorie($categories[4]);
        $article3->addCategorie($categories[2]);
        $article3->setCreatedAt(new \DateTimeImmutable('2026-01-19 15:45:00'));
        $manager->persist($article3);
        $articles[] = $article3;

        $note1_1 = new ArticleNote();
        $note1_1->setArticle($article1);
        $note1_1->setUser($admin);
        $note1_1->setNote(4.5);
        $manager->persist($note1_1);

        $note1_2 = new ArticleNote();
        $note1_2->setArticle($article1);
        $note1_2->setUser($users['subscriber1']);
        $note1_2->setNote(5.0);
        $manager->persist($note1_2);

        $note1_3 = new ArticleNote();
        $note1_3->setArticle($article1);
        $note1_3->setUser($users['subscriber2']);
        $note1_3->setNote(4.0);
        $manager->persist($note1_3);

        $note2_1 = new ArticleNote();
        $note2_1->setArticle($article2);
        $note2_1->setUser($users['subscriber3']);
        $note2_1->setNote(4.5);
        $manager->persist($note2_1);

        $note3_1 = new ArticleNote();
        $note3_1->setArticle($article3);
        $note3_1->setUser($users['subscriber4']);
        $note3_1->setNote(5.0);
        $manager->persist($note3_1);

        $note3_2 = new ArticleNote();
        $note3_2->setArticle($article3);
        $note3_2->setUser($users['subscriber5']);
        $note3_2->setNote(4.5);
        $manager->persist($note3_2);

        $manager->flush();
    }
}