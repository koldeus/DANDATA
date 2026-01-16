<?php

namespace App\Controller;

use App\Entity\Metadonnees;
use App\Entity\Variable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Filesystem\Filesystem;

class MetadonneesUploadController extends AbstractController
{
    #[Route('/api/metadonnees', name: 'metadonnees_upload', methods: ['POST'])]
    #[IsGranted(
        new Expression('is_granted("ROLE_ADMIN") or is_granted("ROLE_DATA_PROVIDER")'),
        message: 'Vous n\'avez pas les droits pour uploader des métadonnées'
    )]
    public function upload(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            $uploadedFile = $request->files->get('file');
            if (!$uploadedFile) {
                return $this->json(['error' => 'Aucun fichier envoyé'], 400);
            }

            $variablesJson = $request->request->get('variables');
            if (!$variablesJson) {
                return $this->json(['error' => 'Variables manquantes'], 400);
            }

            $variablesArray = json_decode($variablesJson, true);
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($variablesArray)) {
                return $this->json(['error' => 'JSON variables invalide'], 400);
            }

            $nbLignesTotal = $request->request->get('NbLignesTotal');
            if ($nbLignesTotal === null) {
                return $this->json(['error' => 'NbLignesTotal manquant'], 400);
            }

            $selectedIdentifierName = $request->request->get('identifier');
            $identificationVariable = null;

            $allowedExtensions = ['csv', 'xlsx', 'xls', 'json'];
            $originalExtension = strtolower(pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_EXTENSION));
            if (!in_array($originalExtension, $allowedExtensions)) {
                return $this->json(['error' => 'Format de fichier non supporté'], 400);
            }

            $maxSize = 50 * 1024 * 1024;
            if ($uploadedFile->getSize() > $maxSize) {
                return $this->json(['error' => 'Fichier trop volumineux (max 50MB)'], 413);
            }

            $originalName = $uploadedFile->getClientOriginalName();
            $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/metadonnees';

            if (!is_dir($uploadsDir)) {
                if (!mkdir($uploadsDir, 0777, true) && !is_dir($uploadsDir)) {
                    return $this->json(['error' => 'Impossible de créer le dossier d\'upload'], 500);
                }
            }

            $fileName = bin2hex(random_bytes(8)) . '.' . $originalExtension;

            try {
                $uploadedFile->move($uploadsDir, $fileName);
            } catch (FileException $e) {
                return $this->json(['error' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()], 500);
            }

            $metadonnees = new Metadonnees();
            $metadonnees->setNom($originalName);
            $metadonnees->setFileName($fileName);
            $metadonnees->setUrl('/uploads/metadonnees/' . $fileName);
            $metadonnees->setApiFichier(false);
            $metadonnees->setExtensionRetour($originalExtension);
            $metadonnees->setNbLignesTotal((int)$nbLignesTotal);
            $metadonnees->setUpdatedAt(new \DateTimeImmutable());

            foreach ($variablesArray as $varData) {
                $variable = new Variable();
                $currentVarName = $varData['name'] ?? 'Variable';

                $variable->setNom($currentVarName);
                $variable->setNumString(($varData['type'] ?? 'categorical') === 'numeric');
                $variable->setColor($varData['color'] ?? '#000000');
                $variable->setMeta($metadonnees);

                $metadonnees->addVariable($variable);
                $em->persist($variable);

                if ($selectedIdentifierName === $currentVarName) {
                    $identificationVariable = $variable;
                }
            }

            if ($identificationVariable) {
                $metadonnees->setVariableIdentification($identificationVariable);
            }

            $em->persist($metadonnees);
            $em->flush();

            return $this->json([
                'id' => $metadonnees->getId(),
                'nom' => $metadonnees->getNom(),
                'fileName' => $metadonnees->getFileName(),
                'url' => $metadonnees->getUrl(),
                'nbLignesTotal' => $metadonnees->getNbLignesTotal(),
                'identifier' => $identificationVariable ? $identificationVariable->getNom() : null,
                'variables' => array_map(fn($v) => [
                    'name' => $v->getNom(),
                    'type' => $v->isNumString() ? 'numeric' : 'categorical',
                    'color' => $v->getColor()
                ], $metadonnees->getVariables()->toArray()),
            ], 201);

        } catch (\Throwable $e) {
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }

    #[Route('/api/metadonnees/{id}', name: 'metadonnees_delete', methods: ['DELETE'])]
    #[IsGranted(
        new Expression('is_granted("ROLE_ADMIN") or is_granted("ROLE_DATA_PROVIDER")'),
        message: 'Vous n\'avez pas les droits pour uploader des métadonnées'
    )]
    public function delete(int $id, EntityManagerInterface $em): JsonResponse
    {
        try {
            $metadonnees = $em->getRepository(Metadonnees::class)->find($id);
            if (!$metadonnees) {
                return $this->json(['error' => 'Métadonnées introuvables'], Response::HTTP_NOT_FOUND);
            }

            $filesystem = new Filesystem();
            $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/metadonnees/' . $metadonnees->getFileName();

            if ($filesystem->exists($filePath)) {
                try {
                    $filesystem->remove($filePath);
                } catch (\Throwable $e) {
                    return $this->json(['error' => 'Impossible de supprimer le fichier', 'details' => $e->getMessage()], 500);
                }
            }

            $em->remove($metadonnees);
            $em->flush();

            return $this->json(null, Response::HTTP_NO_CONTENT);

        } catch (\Throwable $e) {
            return $this->json(['error' => 'Erreur serveur', 'message' => $e->getMessage()], 500);
        }
    }
}