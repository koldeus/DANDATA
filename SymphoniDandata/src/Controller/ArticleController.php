<?php

namespace App\Controller;

use App\Entity\Articles;
use App\Entity\Blocs;
use App\Entity\Titre;
use App\Entity\Texte;
use App\Entity\Graphique;
use App\Entity\User;
use App\Repository\ArticlesRepository;
use App\Repository\ImageRepository;
use App\Repository\UserRepository;
use App\Repository\ThemeRepository;
use App\Repository\MetadonneesRepository;
use App\Repository\VariableRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Doctrine\ORM\Mapping as ORM;

#[Route('/api/articles', name: 'api_articles_')]

class ArticleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ArticlesRepository $articleRepository,
        private UserRepository $userRepository,
        private ThemeRepository $themeRepository,
        private ImageRepository $imageRepository,
        private MetadonneesRepository $metadonneesRepository,
        private VariableRepository $variableRepository,
    ) {
    }

    #[Route('/slug/{slug}', methods: ['GET'])]
    public function getBySlug(Request $request, string $slug): Response
    {
        try {
            $article = $this->articleRepository->findOneBy(['slug' => $slug]);

            if (!$article) {
                return $this->json(
                    ['error' => $slug . 'Article non trouvé'],
                    Response::HTTP_NOT_FOUND
                );
            }

            $response = [
                'id' => $article->getId(),
                'titre' => $article->getTitre(),
                'slug' => $article->getSlug(),
                'resume' => $article->getResume(),
                'createdAt' => $article->getCreatedAt()?->format('c'),
                'auteur' => $article->getAuteur() ? [
                    'id' => $article->getAuteur()->getId(),
                    'pseudo' => $article->getAuteur()->getPseudo(),
                ] : null,
                'theme' => $article->getTheme() ? [
                    'id' => $article->getTheme()->getId(),
                    'nom' => $article->getTheme()->getNom(),
                    'slug' => $article->getTheme()->getSlug(),
                ] : null,
                'imagePrincipale' => $article->getImagePrincipale() ? [
                    'id' => $article->getImagePrincipale()->getId(),
                    'url' => $article->getImagePrincipale()->getUrl(),
                    'alt' => $article->getImagePrincipale()->getAlt(),
                    'fileName' => $article->getImagePrincipale()->getFileName(),
                ] : null,
                'categories' => array_map(function ($categorie) {
                    return [
                        'id' => $categorie->getId(),
                        'Nom' => $categorie->getNom(),
                    ];
                }, $article->getCategories()->toArray()),
                'blocs' => array_map(function ($bloc) {
                    return $this->serializeBloc($bloc);
                }, $article->getBlocs()->toArray()),
                'moyenneNotes' => $article->getMoyenneNotes(),
                'nombreNotes' => $article->getNombreNotes(),
            ];

            return $this->json($response, Response::HTTP_OK);

        } catch (\Exception $e) {
            error_log('Erreur récupération article: ' . $e->getMessage());
            return $this->json([
                'error' => 'Erreur lors de la récupération de l\'article',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route(methods: ['POST'])]
    public function create(Request $request): Response
    {
        $user = $this->getUser();
        if (!$user) {
            error_log('ArticleController: No authenticated user');
            return $this->json(
                ['error' => 'Vous devez être connecté'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        $userRoles = $user->getRoles();
        error_log('ArticleController: User roles: ' . json_encode($userRoles));
        $hasPermission = in_array('ROLE_AUTHOR', $userRoles) || in_array('ROLE_ADMIN', $userRoles);

        if (!$hasPermission) {
            error_log('ArticleController: User does not have permission');
            return $this->json(
                ['error' => 'Vous n\'avez pas la permission de créer des articles. Rôles: ' . implode(', ', $userRoles)],
                Response::HTTP_FORBIDDEN
            );
        }

        try {
            $data = json_decode($request->getContent(), true);

            error_log('Données reçues: ' . json_encode($data));

            if (!is_array($data)) {
                return $this->json(
                    ['error' => 'Données invalides'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            if (empty($data['titre']) || strlen($data['titre']) < 5) {
                return $this->json(
                    ['error' => 'Le titre doit contenir au moins 5 caractères'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            if (empty($data['resume'])) {
                return $this->json(
                    ['error' => 'Le résumé est requis'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            if (empty($data['theme'])) {
                return $this->json(
                    ['error' => 'Le thème est requis'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $article = new Articles();
            $article->setTitre($data['titre']);
            $article->setResume($data['resume']);

            $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['titre'])));
            $existingArticle = $this->articleRepository->findOneBy(['slug' => $slug]);
            if ($existingArticle) {
                $slug = $slug . '-' . time();
            }
            $article->setSlug($slug);

            $user = $this->getUser();
            if (!$user) {
                return $this->json(
                    ['error' => 'Utilisateur non authentifié'],
                    Response::HTTP_UNAUTHORIZED
                );
            }
            $article->setAuteur($user);

            $themeIri = $data['theme'];
            $themeId = $this->extractIdFromIri($themeIri);
            if (!$themeId) {
                return $this->json(
                    ['error' => 'ID de thème invalide'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            $theme = $this->themeRepository->find($themeId);
            if (!$theme) {
                return $this->json(
                    ['error' => "Thème {$themeId} non trouvé"],
                    Response::HTTP_NOT_FOUND
                );
            }
            $article->setTheme($theme);

            if (!empty($data['imagePrincipale'])) {
                $imageIri = $data['imagePrincipale'];
                $imageId = $this->extractIdFromIri($imageIri);
                if ($imageId) {
                    $image = $this->imageRepository->find($imageId);
                    if ($image) {
                        $article->setImagePrincipale($image);
                    }
                }
            }

            $this->entityManager->persist($article);
            $this->entityManager->flush();

            if (!empty($data['blocs']) && is_array($data['blocs'])) {
                foreach ($data['blocs'] as $blocData) {
                    error_log('Traitement bloc: ' . json_encode($blocData));
                    $bloc = $this->createBloc($blocData, $article);
                    if ($bloc) {
                        $article->addBloc($bloc);
                    }
                }
            } else {
                return $this->json(
                    ['error' => 'Aucun bloc fourni'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            if (!empty($data['categories']) && is_array($data['categories'])) {
                foreach ($data['categories'] as $categorieIri) {
                    $categorieId = $this->extractIdFromIri($categorieIri);
                    if ($categorieId) {
                        $categorie = $this->entityManager->getRepository(\App\Entity\Categorie::class)->find($categorieId);
                        if ($categorie) {
                            $article->addCategorie($categorie);
                        }
                    }
                }
            }

            $this->entityManager->flush();

            error_log('Article créé avec succès: ' . $article->getId());

            $response = [
                'id' => $article->getId(),
                'titre' => $article->getTitre(),
                'slug' => $article->getSlug(),
                'resume' => $article->getResume(),
                'message' => 'Article créé avec succès',
            ];

            return $this->json($response, Response::HTTP_CREATED);
        } catch (\Exception $e) {
            error_log('Erreur création article: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return $this->json([
                'error' => 'Erreur lors de la création de l\'article',
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    private function createBloc(array $blocData, Articles $article): ?Blocs
    {
        if (empty($blocData['type'])) {
            error_log('Type de bloc manquant');
            return null;
        }

        error_log('Création bloc de type: ' . $blocData['type']);

        $bloc = new Blocs();
        $bloc->setType($blocData['type']);
        $bloc->setOrdre($blocData['ordre'] ?? 1);
        $bloc->setArticle($article);

        switch ($blocData['type']) {
            case 'titre':
                $titre = new Titre();
                $titre->setTitre($blocData['texte'] ?? '');
                $titre->setNiveau($blocData['niveau'] ?? 2);
                $titre->setBlocs($bloc);
                $this->entityManager->persist($titre);
                $this->entityManager->persist($bloc);
                break;

            case 'texte':
                $texte = new Texte();
                $texte->setTexte($blocData['texte'] ?? '');
                $texte->setBlocs($bloc);
                $this->entityManager->persist($texte);
                $this->entityManager->persist($bloc);
                break;

            case 'image':
                $this->entityManager->persist($bloc);
                if (!empty($blocData['images']) && is_array($blocData['images'])) {
                    foreach ($blocData['images'] as $imageIri) {
                        $imageId = $this->extractIdFromIri($imageIri);
                        $image = $this->imageRepository->find($imageId);
                        if ($image) {
                            $bloc->addImage($image);
                        }
                    }
                }
                break;

            case 'graphique':
                if (empty($blocData['graphique'])) {
                    error_log('Données graphique manquantes');
                    return null;
                }

                error_log('Données graphique: ' . json_encode($blocData['graphique']));

                $graphique = new Graphique();

                if (empty($blocData['graphique']['metadonnees'])) {
                    throw new \Exception('Métad onnées requises pour le graphique');
                }

                $metaIri = $blocData['graphique']['metadonnees'];
                $metaId = $this->extractIdFromIri($metaIri);
                error_log("Recherche métadonnées ID: {$metaId}");

                $meta = $this->metadonneesRepository->find($metaId);
                if (!$meta) {
                    throw new \Exception('Métadonnées non trouvées: ' . $metaIri);
                }

                $graphique->setMetadonnees($meta);
                $graphique->setType($blocData['graphique']['type'] ?? 'bar');
                $graphique->setTitre($blocData['graphique']['titre'] ?? '');
                $graphique->setNbLigne($blocData['graphique']['NbLigne'] ?? '');
                $graphique->setBlocs($bloc);

                $this->entityManager->persist($bloc);
                $this->entityManager->persist($graphique);

                $this->entityManager->flush();

                error_log("Graphique créé avec ID: {$graphique->getId()}");

                if (!empty($blocData['graphique']['variables']) && is_array($blocData['graphique']['variables'])) {
                    error_log('Variables à ajouter: ' . json_encode($blocData['graphique']['variables']));

                    foreach ($blocData['graphique']['variables'] as $variableIri) {
                        $variableId = $this->extractIdFromIri($variableIri);
                        error_log("Traitement variable IRI: {$variableIri} -> ID: {$variableId}");

                        if ($variableId) {
                            $variable = $this->variableRepository->find($variableId);
                            if ($variable) {
                                error_log("Variable trouvée: {$variable->getNom()}");
                                if ($variable->getMeta() && $variable->getMeta()->getId() === $meta->getId()) {
                                    error_log("Ajout variable {$variableId} au graphique {$graphique->getId()}");
                                    $graphique->addVariable($variable);
                                } else {
                                    error_log("Variable {$variableId} n'appartient pas aux métadonnées {$metaId}");
                                }
                            } else {
                                error_log("Variable non trouvée: {$variableId}");
                            }
                        } else {
                            error_log("ID de variable invalide: {$variableIri}");
                        }
                    }

                    $this->entityManager->flush();
                    error_log("Relations variables-graphique sauvegardées");
                } else {
                    error_log("Aucune variable fournie");
                }
                break;

            default:
                error_log("Type de bloc inconnu: {$blocData['type']}");
                return null;
        }

        return $bloc;
    }

    private function serializeBloc(Blocs $bloc): array
    {
        $data = [
            'id' => $bloc->getId(),
            'type' => $bloc->getType(),
            'ordre' => $bloc->getOrdre(),
        ];

        switch ($bloc->getType()) {
            case 'titre':
                $titres = $bloc->getTitres();
                if ($titres && $titres->count() > 0) {
                    $titre = $titres->first();
                    $data['texte'] = $titre->getTitre();
                    $data['niveau'] = $titre->getNiveau();
                }
                break;

            case 'texte':
                $textes = $bloc->getTextes();
                if ($textes && $textes->count() > 0) {
                    $texte = $textes->first();
                    $data['texte'] = $texte->getTexte();
                }
                break;

            case 'image':
                $data['images'] = array_map(function ($image) {
                    return [
                        'id' => $image->getId(),
                        'url' => $image->getUrl(),
                        'alt' => $image->getAlt(),
                        'fileName' => $image->getFileName(),
                    ];
                }, $bloc->getImages()->toArray());
                break;

            case 'graphique':
                $graphiques = $bloc->getGraphiques();
                if ($graphiques && $graphiques->count() > 0) {
                    $graphique = $graphiques->first();
                    $data['graphique'] = [
                        'id' => $graphique->getId(),
                        'type' => $graphique->getType(),
                        'titre' => $graphique->getTitre(),
                        'NbLigne' => $graphique->getNbLigne(),
                        'metadonnees' => $graphique->getMetadonnees() ? [
                            'id' => $graphique->getMetadonnees()->getId(),
                            'nom' => $graphique->getMetadonnees()->getNom(),
                            'NbLignesTotal' => $graphique->getMetadonnees()->getNbLignesTotal(),
                        ] : null,
                        'variables' => array_map(function ($variable) {
                            return [
                                'id' => $variable->getId(),
                                'nom' => $variable->getNom(),
                                'couleur' => $variable->getColor(),
                                'num_string' => $variable->isNumString(),
                                'meta' => $variable->getMeta(),

                            ];
                        }, $graphique->getVariables()->toArray()),
                    ];
                }
                break;
        }

        return $data;
    }

    private function extractIdFromIri(string $iri): ?int
    {
        $parts = explode('/', trim($iri, '/'));
        $id = end($parts);
        return is_numeric($id) ? (int) $id : null;
    }


    #[Route('/{slug}', methods: ['PATCH'])]
    public function update(Request $request, string $slug): Response
    {
        /** @var \App\Entity\User|null $user */
        $user = $this->getUser();
        if (!$user) {
            return $this->json(
                ['error' => 'Vous devez être connecté'],
                Response::HTTP_UNAUTHORIZED
            );
        }

        try {
            $article = $this->articleRepository->findOneBy(['slug' => $slug]);

            if (!$article) {
                return $this->json(
                    ['error' => 'Article non trouvé'],
                    Response::HTTP_NOT_FOUND
                );
            }

            $userRoles = $user->getRoles();
            $isAuthor = $article->getAuteur() && $article->getAuteur()->getId() === $user->getId();
            $isAdmin = in_array('ROLE_ADMIN', $userRoles);
            $isEditor = in_array('ROLE_EDITOR', $userRoles);

            if (!$isAuthor && !$isAdmin && !$isEditor) {
                return $this->json(
                    ['error' => 'Vous n\'avez pas la permission de modifier cet article'],
                    Response::HTTP_FORBIDDEN
                );
            }

            $data = json_decode($request->getContent(), true);

            if (!is_array($data)) {
                return $this->json(
                    ['error' => 'Données invalides'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            if (isset($data['titre']) && !empty($data['titre'])) {
                if (strlen($data['titre']) < 5) {
                    return $this->json(
                        ['error' => 'Le titre doit contenir au moins 5 caractères'],
                        Response::HTTP_BAD_REQUEST
                    );
                }
                $article->setTitre($data['titre']);

                $newSlug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['titre'])));
                $existingArticle = $this->articleRepository->findOneBy(['slug' => $newSlug]);
                if ($existingArticle && $existingArticle->getId() !== $article->getId()) {
                    $newSlug = $newSlug . '-' . time();
                }
                $article->setSlug($newSlug);
            }

            if (isset($data['resume'])) {
                if (empty($data['resume'])) {
                    return $this->json(
                        ['error' => 'Le résumé est requis'],
                        Response::HTTP_BAD_REQUEST
                    );
                }
                $article->setResume($data['resume']);
            }

            if (isset($data['theme'])) {
                $themeIri = $data['theme'];
                $themeId = $this->extractIdFromIri($themeIri);
                if (!$themeId) {
                    return $this->json(
                        ['error' => 'ID de thème invalide'],
                        Response::HTTP_BAD_REQUEST
                    );
                }
                $theme = $this->themeRepository->find($themeId);
                if (!$theme) {
                    return $this->json(
                        ['error' => "Thème {$themeId} non trouvé"],
                        Response::HTTP_NOT_FOUND
                    );
                }
                $article->setTheme($theme);
            }

            if (isset($data['imagePrincipale'])) {
                if ($data['imagePrincipale'] === null) {
                    $article->setImagePrincipale(null);
                } else {
                    $imageIri = $data['imagePrincipale'];
                    $imageId = $this->extractIdFromIri($imageIri);
                    if ($imageId) {
                        $image = $this->imageRepository->find($imageId);
                        if ($image) {
                            $article->setImagePrincipale($image);
                        }
                    }
                }
            }

            if (isset($data['categories']) && is_array($data['categories'])) {
                foreach ($article->getCategories() as $categorie) {
                    $article->removeCategorie($categorie);
                }

                foreach ($data['categories'] as $categorieIri) {
                    $categorieId = $this->extractIdFromIri($categorieIri);
                    if ($categorieId) {
                        $categorie = $this->entityManager->getRepository(\App\Entity\Categorie::class)->find($categorieId);
                        if ($categorie) {
                            $article->addCategorie($categorie);
                        }
                    }
                }
            }

            if (isset($data['blocs']) && is_array($data['blocs'])) {
                foreach ($article->getBlocs() as $bloc) {
                    $this->entityManager->remove($bloc);
                }
                $this->entityManager->flush();

                foreach ($data['blocs'] as $blocData) {
                    error_log('Traitement bloc: ' . json_encode($blocData));
                    $bloc = $this->createBloc($blocData, $article);
                    if ($bloc) {
                        $article->addBloc($bloc);
                    }
                }
            }

            $this->entityManager->flush();

            error_log('Article mis à jour avec succès: ' . $article->getId());

            $response = [
                'id' => $article->getId(),
                'titre' => $article->getTitre(),
                'slug' => $article->getSlug(),
                'resume' => $article->getResume(),
                'createdAt' => $article->getCreatedAt()?->format('c'),
                'auteur' => $article->getAuteur() ? [
                    'id' => $article->getAuteur()->getId(),
                    'pseudo' => $article->getAuteur()->getPseudo(),
                ] : null,
                'theme' => $article->getTheme() ? [
                    'id' => $article->getTheme()->getId(),
                    'nom' => $article->getTheme()->getNom(),
                ] : null,
                'imagePrincipale' => $article->getImagePrincipale() ? [
                    'id' => $article->getImagePrincipale()->getId(),
                    'url' => $article->getImagePrincipale()->getUrl(),
                ] : null,
                'categories' => array_map(function ($categorie) {
                    return [
                        'id' => $categorie->getId(),
                        'Nom' => $categorie->getNom(),
                    ];
                }, $article->getCategories()->toArray()),
                'blocs' => array_map(function ($bloc) {
                    return $this->serializeBloc($bloc);
                }, $article->getBlocs()->toArray()),
                'message' => 'Article mis à jour avec succès',
            ];

            return $this->json($response, Response::HTTP_OK);

        } catch (\Exception $e) {
            error_log('Erreur mise à jour article: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return $this->json([
                'error' => 'Erreur lors de la mise à jour de l\'article',
                'message' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}