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
    #[Route('/api/images/upload', name: 'upload_image', methods: ['POST'])]
    public function upload(Request $request, EntityManagerInterface $em): Response
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
            if (!extension_loaded('gd')) {
                return new Response(json_encode([
                    'error' => 'GD extension is not loaded. Please install php-gd: sudo apt-get install php-gd'
                ]), 500, ['Content-Type' => 'application/json']);
            }

            if (
                !$this->isGranted('ROLE_ADMIN') &&
                !$this->isGranted('ROLE_DESIGNER') &&
                !$this->isGranted('ROLE_EDITOR')
            ) {
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

            $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!in_array($file->getMimeType(), $allowedMimes)) {
                return new Response(json_encode(['error' => 'Invalid file type']), 400, [
                    'Content-Type' => 'application/json'
                ]);
            }

            $maxSize = 5 * 1024 * 1024;
            if ($file->getSize() > $maxSize) {
                return new Response(json_encode(['error' => 'File too large']), 413, [
                    'Content-Type' => 'application/json'
                ]);
            }

            $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/images';
            if (!is_dir($uploadDir)) {
                if (!mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
                    throw new \Exception('Failed to create upload directory');
                }
            }

            if (!is_writable($uploadDir)) {
                throw new \Exception('Upload directory is not writable: ' . $uploadDir);
            }

            $originalInfo = \getimagesize($file->getPathname());
            if (!$originalInfo) {
                return new Response(json_encode(['error' => 'Invalid image file']), 400, [
                    'Content-Type' => 'application/json'
                ]);
            }
            $originalWidth = $originalInfo[0];
            $originalHeight = $originalInfo[1];
            $originalSize = $file->getSize();

            $fileName = \bin2hex(\random_bytes(8)) . '.webp';
            $filePath = $uploadDir . '/' . $fileName;

            $optimizationData = $this->optimizeImage($file->getPathname(), $filePath);

            $imageEntity = new Image();
            $imageEntity->setFileName($fileName);
            $imageEntity->setAlt($request->get('alt', '') ?: '');
            $imageEntity->setSlug(\pathinfo($fileName, PATHINFO_FILENAME));

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

        } catch (\Exception $e) {
            \error_log('Image upload error: ' . $e->getMessage());
            \error_log('Stack trace: ' . $e->getTraceAsString());

            return new Response(json_encode([
                'error' => 'Image processing failed: ' . $e->getMessage()
            ]), 500, ['Content-Type' => 'application/json']);
        }
    }

    /**
     * Optimize image using GD library and return metadata
     */
    private function optimizeImage(string $sourcePath, string $destPath): array
    {
        if (!function_exists('imagecreatefromstring')) {
            throw new \Exception('GD function imagecreatefromstring not available');
        }

        $imageContent = @\file_get_contents($sourcePath);
        if ($imageContent === false) {
            throw new \Exception('Failed to read source image file');
        }

        $image = @\imagecreatefromstring($imageContent);
        if (!$image) {
            throw new \Exception('Failed to create image from file. GD may not be properly installed.');
        }

        $width = \imagesx($image);
        $height = \imagesy($image);
        $resized = false;

        if ($width > 2000 || $height > 2000) {
            $ratio = \min(2000 / $width, 2000 / $height);
            $newWidth = (int) ($width * $ratio);
            $newHeight = (int) ($height * $ratio);

            $resizedImage = \imagecreatetruecolor($newWidth, $newHeight);
            if (!$resizedImage) {
                \imagedestroy($image);
                throw new \Exception('Failed to create resized image canvas');
            }

            
            \imagealphablending($resizedImage, false);
            \imagesavealpha($resizedImage, true);

            if (!\imagecopyresampled($resizedImage, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height)) {
                \imagedestroy($image);
                \imagedestroy($resizedImage);
                throw new \Exception('Failed to resize image');
            }

            \imagedestroy($image);
            $image = $resizedImage;
            $width = $newWidth;
            $height = $newHeight;
            $resized = true;
        }

        
        if (!\imagewebp($image, $destPath, 80)) {
            \imagedestroy($image);
            throw new \Exception('Failed to save WebP image. Check if directory is writable.');
        }

        \imagedestroy($image);

        $fileSize = @\filesize($destPath);
        if ($fileSize === false) {
            throw new \Exception('Failed to get file size of saved image');
        }

        return [
            'width' => $width,
            'height' => $height,
            'size' => $fileSize,
            'resized' => $resized,
        ];
    }
}