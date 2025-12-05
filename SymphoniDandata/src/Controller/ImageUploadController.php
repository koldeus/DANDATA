<?php

namespace App\Controller;

use App\Entity\Image;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class ImageUploadController extends AbstractController
{
    #[Route('/api/images', name: 'upload_image', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function upload(Request $request, EntityManagerInterface $em): Response
    {
        // Check roles
        if (!$this->isGranted('ROLE_ADMIN') && 
            !$this->isGranted('ROLE_DESIGNER') && 
            !$this->isGranted('ROLE_EDITOR')) {
            return new Response(json_encode(['error' => 'Access denied']), 403, [
                'Content-Type' => 'application/json'
            ]);
        }

        /** @var UploadedFile $file */
        $file = $request->files->get('file');

        if (!$file) {
            return new Response(json_encode(['error' => 'No file sent']), 400, [
                'Content-Type' => 'application/json'
            ]);
        }

        // Validate file
        $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            return new Response(json_encode(['error' => 'Invalid file type']), 400, [
                'Content-Type' => 'application/json'
            ]);
        }

        $maxSize = 5 * 1024 * 1024; // 5MB
        if ($file->getSize() > $maxSize) {
            return new Response(json_encode(['error' => 'File too large']), 413, [
                'Content-Type' => 'application/json'
            ]);
        }

        // Create uploads directory if not exists
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/images';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        // Get original image info
        $originalInfo = getimagesize($file->getPathname());
        if (!$originalInfo) {
            return new Response(json_encode(['error' => 'Invalid image file']), 400, [
                'Content-Type' => 'application/json'
            ]);
        }
        $originalWidth = $originalInfo[0];
        $originalHeight = $originalInfo[1];
        $originalSize = $file->getSize();

        try {
            // Generate secure filename
            $fileName = bin2hex(random_bytes(8)) . '.webp';
            $filePath = $uploadDir . '/' . $fileName;

            // Convert and optimize image using GD
            $optimizationData = $this->optimizeImage($file->getPathname(), $filePath);

        } catch (\Exception $e) {
            return new Response(json_encode(['error' => 'Image processing failed: ' . $e->getMessage()]), 400, [
                'Content-Type' => 'application/json'
            ]);
        }

        // Save entity
        $imageEntity = new Image();
        $imageEntity->setFileName($fileName);
        $imageEntity->setAlt($request->get('alt', '') ?: '');
        $imageEntity->setSlug(pathinfo($fileName, PATHINFO_FILENAME));

        $em->persist($imageEntity);
        $em->flush();

        return new Response(json_encode([
            'id' => $imageEntity->getId(),
            'url' => '/uploads/images/' . $fileName,
            'alt' => $imageEntity->getAlt(),
            'metadata' => [
                'original' => [
                    'width' => $originalWidth,
                    'height' => $originalHeight,
                    'size' => $originalSize,
                    'aspect_ratio' => round($originalWidth / $originalHeight, 2),
                ],
                'optimized' => [
                    'width' => $optimizationData['width'],
                    'height' => $optimizationData['height'],
                    'size' => $optimizationData['size'],
                    'format' => 'webp',
                    'quality' => 80,
                    'aspect_ratio' => round($optimizationData['width'] / $optimizationData['height'], 2),
                ],
                'compression' => [
                    'ratio' => round((1 - $optimizationData['size'] / $originalSize) * 100, 2) . '%',
                    'bytes_saved' => $originalSize - $optimizationData['size'],
                    'resized' => $originalWidth !== $optimizationData['width'],
                ],
            ],
        ]), 201, ['Content-Type' => 'application/json']);
    }

    /**
     * Optimize image using GD library and return metadata
     */
    private function optimizeImage(string $sourcePath, string $destPath): array
    {
        // Load original image
        $image = imagecreatefromstring(file_get_contents($sourcePath));
        if (!$image) {
            throw new \Exception('Failed to load image');
        }

        $width = imagesx($image);
        $height = imagesy($image);
        $resized = false;

        // Resize if too large
        if ($width > 2000 || $height > 2000) {
            $ratio = min(2000 / $width, 2000 / $height);
            $newWidth = (int)($width * $ratio);
            $newHeight = (int)($height * $ratio);

            $resizedImage = imagecreatetruecolor($newWidth, $newHeight);
            if (!imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height)) {
                throw new \Exception('Failed to resize image');
            }
            imagedestroy($image);
            $image = $resizedImage;
            $width = $newWidth;
            $height = $newHeight;
            $resized = true;
        }

        // Save as WebP with compression
        if (!imagewebp($image, $destPath, 80)) {
            throw new \Exception('Failed to save WebP image');
        }

        imagedestroy($image);

        return [
            'width' => $width,
            'height' => $height,
            'size' => filesize($destPath),
            'resized' => $resized,
        ];
    }
}
