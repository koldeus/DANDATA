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
    #[Route('/api/metadonnees/upload', name: 'metadonnees_upload', methods: ['POST'])]
    #[IsGranted('ROLE_DATA_PROVIDER')]
    public function upload(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $uploadedFile = $request->files->get('file');
        $variablesData = $request->request->get('variables'); // JSON string

        if (!$uploadedFile) {
            return $this->json(['error' => 'Aucun fichier envoyé'], 400);
        }

        if (!$variablesData) {
            return $this->json(['error' => 'Variables manquantes'], 400);
        }

        $variablesArray = json_decode($variablesData, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            return $this->json(['error' => 'Format JSON des variables invalide'], 400);
        }

        // Validate file
        $allowedExtensions = ['csv', 'xlsx', 'xls', 'json'];
        $originalExtension = strtolower(pathinfo($uploadedFile->getClientOriginalName(), PATHINFO_EXTENSION));
        if (!in_array($originalExtension, $allowedExtensions)) {
            return $this->json(['error' => 'Format de fichier non supporté. Formats acceptés: ' . implode(', ', $allowedExtensions)], 400);
        }

        $maxSize = 50 * 1024 * 1024; // 50MB for metadata files
        if ($uploadedFile->getSize() > $maxSize) {
            return $this->json(['error' => 'Fichier trop volumineux (max 50MB)'], 413);
        }

        // Get file metadata before upload
        $originalSize = $uploadedFile->getSize();
        $originalName = $uploadedFile->getClientOriginalName();

        // Save the uploaded file
        $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads/metadonnees';
        if (!is_dir($uploadsDir)) {
            mkdir($uploadsDir, 0755, true);
        }

        $fileName = bin2hex(random_bytes(8)) . '.' . $originalExtension;

        try {
            $uploadedFile->move($uploadsDir, $fileName);
        } catch (FileException $e) {
            return $this->json(['error' => 'Erreur lors de l\'upload du fichier'], 500);
        }

        $filePath = $uploadsDir . '/' . $fileName;
        $finalSize = filesize($filePath);

        // Create Metadonnees entity
        $metadonnees = new Metadonnees();
        $metadonnees->setNom($originalName);
        $metadonnees->setFileName($fileName);
        $metadonnees->setUrl('/uploads/metadonnees/' . $fileName);
        $metadonnees->setApiFichier(false);
        $metadonnees->setExtensionRetour($originalExtension);
        $metadonnees->setUpdatedAt(new \DateTimeImmutable());

        // Create Variable entities
        foreach ($variablesArray as $varData) {
            $variable = new Variable();
            $variable->setNom($varData['name'] ?? 'Variable');
            $variable->setNumString($varData['type'] ?? 'categorical');
            $variable->setColor($varData['color'] ?? '#000000');
            $variable->setMeta($metadonnees);

            $metadonnees->addVariable($variable);
        }

        $em->persist($metadonnees);
        $em->flush();

        // Return response with metadata
        return $this->json([
            'id' => $metadonnees->getId(),
            'nom' => $metadonnees->getNom(),
            'fileName' => $metadonnees->getFileName(),
            'url' => $metadonnees->getUrl(),
            'variables' => array_map(fn($v) => [
                'name' => $v->getNom(),
                'type' => $v->getNumString(),
                'color' => $v->getColor()
            ], $metadonnees->getVariables()->toArray()),
            'metadata' => [
                'file' => [
                    'name' => $originalName,
                    'size' => $originalSize,
                    'format' => $originalExtension,
                    'uploaded_at' => $metadonnees->getUpdatedAt()->format('Y-m-d H:i:s'),
                ],
                'variables_count' => count($variablesArray),
            ],
        ], 201);
    }
}
