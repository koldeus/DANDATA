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

class MetadonneesUploadController extends AbstractController
{
    #[Route('/api/metadonnees', name: 'metadonnees_upload', methods: ['POST'])]

    public function upload(Request $request, EntityManagerInterface $em): JsonResponse
    {
        try {
            // Debug logging
            error_log("=== Upload Request Debug ===");
            error_log("Content-Type: " . $request->headers->get('Content-Type'));
            error_log("Files received: " . print_r(array_keys($request->files->all()), true));
            error_log("Request params: " . print_r($request->request->all(), true));

            $uploadedFile = $request->files->get('file');

            if (!$uploadedFile) {
                return $this->json(['error' => 'Aucun fichier envoyé'], 400);
            }

            // Pour FormData, les données sont dans $request->request
            $variablesJson = $request->request->get('variables');

            error_log("Variables JSON received: " . $variablesJson);

            if (!$variablesJson) {
                return $this->json(['error' => 'Variables manquantes'], 400);
            }

            $variablesArray = json_decode($variablesJson, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                return $this->json([
                    'error' => 'Erreur de parsing JSON',
                    'details' => json_last_error_msg()
                ], 400);
            }

            if (!is_array($variablesArray)) {
                return $this->json(['error' => 'Format JSON des variables invalide'], 400);
            }

            // Validate file
            $allowedExtensions = ['csv', 'xlsx', 'xls', 'json'];
            $originalExtension = strtolower(pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_EXTENSION));
            if (!in_array($originalExtension, $allowedExtensions)) {
                return $this->json([
                    'error' => 'Format de fichier non supporté. Formats acceptés: ' . implode(', ', $allowedExtensions)
                ], 400);
            }

            $maxSize = 50 * 1024 * 1024; // 50MB
            if ($uploadedFile->getSize() > $maxSize) {
                return $this->json(['error' => 'Fichier trop volumineux (max 50MB)'], 413);
            }

            $originalName = $uploadedFile->getClientOriginalName();

            // Save file
            $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/metadonnees';
            if (!is_dir($uploadsDir)) {
                if (!mkdir($uploadsDir, 0755, true)) {
                    return $this->json(['error' => 'Impossible de créer le dossier d\'upload'], 500);
                }
            }

            $fileName = bin2hex(random_bytes(8)) . '.' . $originalExtension;

            try {
                $uploadedFile->move($uploadsDir, $fileName);
            } catch (FileException $e) {
                error_log("File move error: " . $e->getMessage());
                return $this->json(['error' => 'Erreur lors de l\'upload du fichier: ' . $e->getMessage()], 500);
            }

            // Create Metadonnees
            $metadonnees = new Metadonnees();
            $metadonnees->setNom($originalName);
            $metadonnees->setFileName($fileName);
            $metadonnees->setUrl('/uploads/metadonnees/' . $fileName);
            $metadonnees->setApiFichier(false);
            $metadonnees->setExtensionRetour($originalExtension);
            $metadonnees->setUpdatedAt(new \DateTimeImmutable());

            // Create Variables
            foreach ($variablesArray as $varData) {
                $variable = new Variable();
                $variable->setNom($varData['name'] ?? 'Variable');
                
                // Convertir le type string en boolean (false = categorical, true = numeric)
                $isNumeric = ($varData['type'] ?? 'categorical') === 'numeric';
                $variable->setNumString($isNumeric);
                
                $variable->setColor($varData['color'] ?? '#000000');
                $variable->setMeta($metadonnees);

                $metadonnees->addVariable($variable);
                $em->persist($variable);
            }

            $em->persist($metadonnees);
            $em->flush();

            return $this->json([
                'id' => $metadonnees->getId(),
                'nom' => $metadonnees->getNom(),
                'fileName' => $metadonnees->getFileName(),
                'url' => $metadonnees->getUrl(),
                'variables' => array_map(fn($v) => [
                    'name' => $v->getNom(),
                    'type' => $v->isNumString() ? 'numeric' : 'categorical',
                    'color' => $v->getColor()
                ], $metadonnees->getVariables()->toArray()),
            ], 201);

        } catch (\Throwable $e) {
            error_log("Exception in upload: " . $e->getMessage());
            error_log("Trace: " . $e->getTraceAsString());

            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}