<?php
// src/Controller/MetadonneesFileController.php
namespace App\Controller;

use App\Entity\Metadonnees;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;

class MetadonneesFileController extends AbstractController
{
    public function __invoke(Metadonnees $data): Response
    {
        $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/metadonnees/' . $data->getFileName();

        if (!file_exists($filePath)) {
            return $this->json(['error' => 'Fichier introuvable'], 404);
        }

        $response = new Response(file_get_contents($filePath));
        $response->headers->set('Content-Type', 'text/csv');
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');

        return $response;
    }
}
